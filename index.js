const _ = require('lodash');
const axios = require('axios').default;
const config = require('./config/config.json');
const Binance = require('binance-api-node').default;
const { UniversalWalletFetcher, WALLETS } = require('./WalletFetcher');
const { initializeApp } = require('@firebase/app');
const { getFirestore, doc, setDoc, updateDoc } = require('@firebase/firestore');

initializeApp(config.firebase);
const database = getFirestore();

const overwrite = {
  TWD: 0.032,
  USD: 1,
};

const COIN2ID = {
  MAX: 5067,
};
async function fetchYahooIndex(symbol) {
  try {
    const res = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`);
    return res.data.chart.result[0].meta.regularMarketPrice;
  } catch (e) {
    console.error('Failed to fetch', symbol, e.message);
    return null;
  }
}

async function fetchTokenPrice(tokens) {
  const keys = config.coinmarketcap.cmc_api_keys;
  const key = keys[new Date().getHours() % keys.length];
  // Ensure BTC is fetched even if not in portfolio
  const fetch_tokens = _.union(tokens, ['BTC']);
  const batch_list = fetch_tokens.filter(x => !~x.indexOf('_') && !~x.indexOf(' ')).join(',');
  const query = `CMC_PRO_API_KEY=${key}&aux=cmc_rank&symbol=${batch_list}`;
  const res = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?${query}`);
  const data = res.data.data;
  const results = Object.keys(data).map(k => {
    return [
      k,
      data[k].length > 0
        ? (COIN2ID[k]
          ? data[k].filter(x => x.id === COIN2ID[k])
          : data[k]
        )[0].quote.USD.price || 0
        : 0,
    ];
  })
  return Object.fromEntries(results);
}

async function constructPriceMap(assets, stock_prices) {
  const price_map = {};
  const prices = await fetchTokenPrice(assets);
  assets.forEach(k => {
    price_map[k] = 0;
    if (stock_prices[k]) {
      price_map[k] = stock_prices[k];
      return;
    }
    if (k === 'USDT') {
      price_map[k] = 1;
    }
    price_map[k] = overwrite[k] || prices[k] || 0;
  });
  // Add baseline assets
  price_map['BTC'] = prices['BTC'] || 0;
  const sp500 = await fetchYahooIndex('^GSPC');
  if (sp500) price_map['SP500'] = sp500;
  const taiex = await fetchYahooIndex('^TWII');
  if (taiex) price_map['TAIEX'] = taiex;
  
  console.log(price_map);
  return price_map;
}

(async () => {
  const stock_prices = {};
  const results = {};
  const positions = {};
  for (const type of WALLETS) {
    for (const cnf of config[type]) {
      if (!results[cnf.id]) {
        results[cnf.id] = [];
      }
      console.log(type, cnf.id);
      const balances = await UniversalWalletFetcher(type, cnf);
      results[cnf.id].push(...balances);
      if (['firstrade', 'ibkr'].includes(type)) {
        for (const { asset, price } of balances) {
          stock_prices[asset] = price;
        }
      }
      if (type == 'binance') {
        if (!positions[cnf.id]) {
          positions[cnf.id] = [];
        }
        const client = Binance({
          apiKey: cnf.APIKEY,
          apiSecret: cnf.APISECRET,
        });
        const info = await client.futuresPositionRisk();

        positions[cnf.id] = info
          .filter(x => +(x.positionAmt) !== 0)
          .map(({ symbol, positionAmt, unRealizedProfit, markPrice, notional }) => ({
            symbol,
            notional: +notional,
            markPrice: +markPrice,
            positionAmt: +positionAmt,
            unRealizedProfit: +unRealizedProfit,
          }));
      }
    }
  }

  let assets = [];
  for (const id of Object.keys(results)) {
    const res = {
      time: Date.now(),
      estimate_total_cost: 0,
      data: results[id],
      positions: positions[id],
    };
    const doc1 = doc(database, `asset/${id}`);
    await setDoc(doc1, res);

    assets = _.union(assets, results[id]
      .map(x => x.asset)
    );
  }

  const today = ((new Date())).toISOString().slice(0, 10);
  const price_map = await constructPriceMap(assets, stock_prices);

  const snapshotRef = doc(database, 'price', 'history', 'snapshots', today);
  await setDoc(snapshotRef, price_map);

  // update NAV
  for (const id of Object.keys(results)) {
    const nav = _.sum(results[id].map(a => price_map[a.asset] * a.size));
    const doc2 = doc(database, `nav/${id}`);
    await updateDoc(doc2, {
      [today]: nav,
    });
  }

  process.exit(0);
})();

