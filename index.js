const _ = require('lodash');
const fs = require('fs');
const axios = require('axios').default;
const Binance = require('node-binance-api');
const config = require('./config/config.json');

async function fetchSpotWallet(client) {
    const res = await client.balance();
    return Object.entries(res)
        .map(([k, v]) => ({ asset: k, size: (+v.available) + (+v.onOrder)}))
        .filter(x => x.size > 0 && x.asset.indexOf('LD') != 0);
}

async function fetchEarnWallet(client) {
    const res = await client.lending();
    return res.positionAmountVos
        .map(x => ({asset: x.asset, size: +x.amount}))
        .filter(x => x.size > 0);
}

async function fetchEarnWallet(client) {
    const res = await client.lending();
    return res.positionAmountVos
        .map(x => ({asset: x.asset, size: +x.amount}))
        .filter(x => x.size > 0);
}

async function fetchFuturesWallet(client) {
    const res = await client.deliveryBalance();
    return res
        .map(x => ({asset: x.asset, size: +x.balance}))
        .filter(x => x.size > 0);
}

async function fetchPerpetualWallet(client) {
    const res = await client.futuresBalance();
    return res
        .map(x => ({asset: x.asset, size: +x.balance}))
        .filter(x => x.size > 0);
}

async function fetchTokenPrice(tokens) {
    const res = await axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tokens.join(',')}&tsyms=USD`);
    return res.data;
}

(async () => {
    const client = new Binance().options(config);
    const spot = await fetchSpotWallet(client);
    const earn = await fetchEarnWallet(client);
    const futs = await fetchFuturesWallet(client);
    const perp = await fetchPerpetualWallet(client);

    const asset_map = {};
    for (const x of [spot, futs, earn, perp]) {
        for (const {asset, size} of x) {
            asset_map[asset] = asset_map[asset] ? asset_map[asset] + size : size;
        }
    }

    const prices = await fetchTokenPrice(Object.keys(asset_map));
    const result = Object.keys(asset_map).map(k => ({
        asset: k,
        size: asset_map[k],
        price: prices[k]['USD'],
    }));
    console.log(result)
    fs.writeFileSync('asset.json', JSON.stringify(result));

})();

