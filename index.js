const _ = require('lodash');
const axios = require('axios').default;
const Binance = require('node-binance-api');
const Binance2 = require('binance-api-node').default;
const config = require('./config/config.json');
const { initializeApp } = require("@firebase/app");
const { getFirestore, doc, setDoc, updateDoc } = require("@firebase/firestore");

initializeApp(config.firebase);
const database = getFirestore();

const alias = {
    EPS: 'ELLIP',
    ONG: 'ONGAS',
    COS: 'CONT',
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

/**
 * It only consider cash flow between C2C and SPOT wallet
 */
async function fetchEstimateTotalCost(key, secret) {
    const USD = ['USDT', 'BUSD', 'USDC'];
    const client = new Binance2({
        apiKey: key,
        apiSecret: secret,
    });
    const in_flow = (await client.universalTransferHistory({ type: 'C2C_MAIN', size: 100 })).rows || [];
    const out_flow = (await client.universalTransferHistory({ type: 'MAIN_C2C', size: 100 })).rows || [];
    const total_in = _.sumBy(in_flow.filter(r => ~USD.indexOf(r.asset)), x => +x.amount);
    const total_out = _.sumBy(out_flow.filter(r => ~USD.indexOf(r.asset)), x => +x.amount);
    return total_in - total_out;
}

(async () => {
    let assets = [];
    const results = {};
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

        const result = Object.keys(asset_map).map(k => ({
            asset: k,
            size: asset_map[k],
        }));
        results[cnf.id] = result;
        assets = _.union(assets, Object.keys(asset_map));

        const res = {
            time: Date.now(),
            estimate_total_cost: (await fetchEstimateTotalCost(cnf.APIKEY, cnf.APISECRET)),
            data: result,
        };
        const doc1 = doc(database, `asset/${cnf.id}`);
        await setDoc(doc1, res);

    }
    let price_map = {};
    const prices = await fetchTokenPrice(assets);
    console.log(prices)
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
    for (const cnf of config.binance) {
        const nav = _.sum(results[cnf.id].map(a => price_map[a.asset] * a.size));
        const doc2 = doc(database, `nav/${cnf.id}`);
        await updateDoc(doc2, {
            [((new Date())).toISOString().substr(0, 10)]: nav,
        });
    }

    process.exit(0);
})();

