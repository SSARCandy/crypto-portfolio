const _ = require('lodash');
const axios = require('axios').default;
const config = require('./config/config.json');
const { UniversalWalletFetcher } = require('./WalletFetcher');
const { initializeApp } = require('@firebase/app');
const { getFirestore, doc, setDoc, updateDoc } = require('@firebase/firestore');

initializeApp(config.firebase);
const database = getFirestore();

const alias = {
  EPS: 'ELLIP',
  ONG: 'ONGAS',
  COS: 'CONT',
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

const WALLETS = [
  'binance',
  'whalefin',
  'ftx',
  'terra',
  'tezos',
];

(async () => {
  const results = {};
  for (const type of WALLETS) {
    for (const cnf of config[type]) {
      if (!results[cnf.id]) {
        results[cnf.id] = [];
      }
      const balances = await UniversalWalletFetcher(type, cnf);
      results[cnf.id].push(...balances);
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
  let price_map = {};
  const prices = await fetchTokenPrice(assets);
  console.log(prices);
  assets.forEach(k => {
    price_map[k] = 0;
    try {
      price_map[k] = prices[alias[k] || k]['USD'];
    } catch (e) {
      console.log(`cannot found ${k} price`);
    }
  });
  const price_doc = doc(database, 'price/spot');
  await setDoc(price_doc, price_map);

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

