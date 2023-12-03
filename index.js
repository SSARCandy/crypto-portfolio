const _ = require('lodash');
const axios = require('axios').default;
const config = require('./config/config.json');
const { UniversalWalletFetcher, WALLETS } = require('./WalletFetcher');
const { initializeApp } = require('@firebase/app');
const { getFirestore, doc, setDoc, updateDoc } = require('@firebase/firestore');

initializeApp(config.firebase);
const database = getFirestore();

const alias = {
  EPS: 'ELLIP',
  ONG: 'ONGAS',
  COS: 'CONT',
  MNT: 'MANTLE',
};
const overwrite = {
  TWD: 0.032,
  TTT: 1e-8, // TODO: can't get correct price
};

async function fetchTokenPrice(tokens) {
  let result = {};
  const BATCH = 50;
  for (let i = 0; i < tokens.length; i += BATCH) {
    const batch_list = _.slice(tokens, i, i + BATCH).map(x => alias[x] || x).join(',');
    const res = await axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${batch_list}&tsyms=USD`);
    result = {
      ...result,
      ...res.data,
    };
  }
  return result;
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
    try {
      price_map[k] = prices[alias[k] || k]['USD'];
      if (overwrite[k]) {
        price_map[k] = overwrite[k];
      }
    } catch (e) {
      console.log(`cannot found ${k} price`);
    }
  });
  console.log(price_map);
  return price_map;
}

(async () => {
  const stock_prices = {};
  const results = {};
  for (const type of WALLETS) {
    for (const cnf of config[type]) {
      if (!results[cnf.id]) {
        results[cnf.id] = [];
      }
      console.log(type, cnf.id);
      const balances = await UniversalWalletFetcher(type, cnf);
      results[cnf.id].push(...balances);
      if (type == 'firstrade') {
        for (const { asset, price } of balances){
          stock_prices[asset] = price;
        }
      }
    }
  }

  let assets = [];
  for (const id of Object.keys(results)) {
    const res = {
      time: Date.now(),
      estimate_total_cost: 0,
      data: results[id],
    };
    const doc1 = doc(database, `asset/${id}`);
    await setDoc(doc1, res);

    assets = _.union(assets, results[id].map(x => x.asset));
  }
  const price_map = await constructPriceMap(assets, stock_prices);
  const crypto_px = doc(database, 'price/spot');
  await setDoc(crypto_px, price_map);

  // update NAV
  for (const id of Object.keys(results)) {
    const nav = _.sum(results[id].map(a => price_map[a.asset] * a.size));
    const doc2 = doc(database, `nav/${id}`);
    await updateDoc(doc2, {
      [((new Date())).toISOString().substr(0, 10)]: nav,
    });
  }

  process.exit(0);
})();

