const Binance = require('node-binance-api');
const Binance2 = require('binance-api-node').default;

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

async function walletFetcher(credentials) {
  const client = new Binance().options(credentials);
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
      wallet: 'binance',
  }));
  return result;
}

module.exports = walletFetcher;