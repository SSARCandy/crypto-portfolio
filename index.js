const _ = require('lodash');
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

(async () => {
    const client = new Binance().options(config);
    const spot = await fetchSpotWallet(client);
    const earn = await fetchEarnWallet(client);
    const futs = await fetchFuturesWallet(client);
    const perp = await fetchPerpetualWallet(client);
    console.log(spot);
    console.log(earn);
    console.log(futs);
    console.log(perp);

    const asset_map = {};
    for (const x of [spot, futs, earn, perp]) {
        for (const {asset, size} of x) {
            asset_map[asset] = asset_map[asset] ? asset_map[asset] + size : size;
        }
    }
    console.log(asset_map);
})();

