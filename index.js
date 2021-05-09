const _ = require('lodash');
const axios = require('axios').default;
const Binance = require('node-binance-api');
const config = require('./config/config.json');
const { initializeApp } = require("@firebase/app");
const { getFirestore, doc, setDoc, updateDoc } = require("@firebase/firestore");

initializeApp(config.firebase);
const database = getFirestore();

const alias = {
    EPS: 'ELLIP',
};

async function fetchSpotWallet(client) {
    const res = await client.balance();
    return Object.entries(res)
        .map(([k, v]) => ({ asset: k, size: (+v.available) + (+v.onOrder) }))
        .filter(x => x.size > 0 && x.asset.indexOf('LD') != 0);
}

async function fetchEarnWallet(client) {
    const res = await client.lending();
    return res.positionAmountVos
        .map(x => ({ asset: x.asset, size: +x.amount }))
        .filter(x => x.size > 0);
}

async function fetchFuturesWallet(client) {
    try {
        const res = await client.deliveryBalance();
        return res
            .map(x => ({ asset: x.asset, size: +x.balance }))
            .filter(x => x.size > 0);
    } catch (e) {
        return [];
    }
}

async function fetchPerpetualWallet(client) {
    try {
        const res = await client.futuresBalance();
        return res
            .map(x => ({ asset: x.asset, size: +x.balance }))
            .filter(x => x.size > 0);
    } catch (e) {
        return [];
    }
}

async function fetchTokenPrice(tokens) {
    const tokenlist = tokens.map(x => alias[x] || x).join(',');
    const res = await axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tokenlist}&tsyms=USD`);
    return res.data;
}

(async () => {
    for (const cnf of config.binance) {
        const client = new Binance().options(cnf);
        const spot = await fetchSpotWallet(client);
        const earn = await fetchEarnWallet(client);
        const futs = await fetchFuturesWallet(client);
        const perp = await fetchPerpetualWallet(client);

        const asset_map = {};
        for (const x of [spot, futs, earn, perp]) {
            for (const { asset, size } of x) {
                asset_map[asset] = asset_map[asset] ? asset_map[asset] + size : size;
            }
        }

        const prices = await fetchTokenPrice(Object.keys(asset_map));
        const result = Object.keys(asset_map).map(k => ({
            asset: k,
            size: asset_map[k],
            price: prices[alias[k] || k]['USD'],
        }));
        console.log(result);

        const res = {
            time: Date.now(),
            data: result,
        };
        const doc1 = doc(database, `asset/${cnf.id}`);
        await setDoc(doc1, res);

        const nav = _.sum(result.map(a => a.price * a.size));
        const doc2 = doc(database, `nav/${cnf.id}`);
        await updateDoc(doc2, { 
            [((new Date())).toISOString().substr(0, 10)]: nav,
        });
    }
    process.exit(0);
})();

