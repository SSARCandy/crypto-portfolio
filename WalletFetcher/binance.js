const Binance = require('node-binance-api');
const Binance2 = require('binance-api-node').default;

async function fetchLockStacking(client) {
  const lock_staking = await client.privateRequest('GET', '/sapi/v1/staking/position', {
    product: 'STAKING',
  });
  const lock_defi = await client.privateRequest('GET', '/sapi/v1/staking/position', {
    product: 'L_DEFI',
  });
  const defi = await client.privateRequest('GET', '/sapi/v1/staking/position', {
    product: 'F_DEFI',
  });

  return Object.values([
    ...lock_staking,
    ...lock_defi,
    ...defi,
  ].map(x => ({
    asset: x.asset,
    size: +x.amount,
  }))
    .reduce((acc, { asset, size }) => {
      const prev_sz = (acc[asset] || {}).size || 0;
      acc[asset] = { 
        asset: asset,
        size: prev_sz + size,
      };
      return acc;
    }, {}));
}

async function fetchSpotWallet(client) {
  const res = await client.balance();
  return Object.entries(res)
    .map(([k, v]) => ({ asset: k, size: (+v.available) + (+v.onOrder) }))
    .filter(x => x.size > 0 && x.asset.indexOf('LD') != 0);
}

async function fetchEarnWallet(client) {
  const res = await client.privateRequest('GET', '/sapi/v1/simple-earn/flexible/position', {
    size: 100,
  });
  return res.rows
    .map(x => ({ asset: x.asset, size: +x.totalAmount }))
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
  const client = new Binance().options({
    ...credentials,
    'family': 4,
  });
  const client2 = Binance2({
    apiKey: credentials.APIKEY,
    apiSecret: credentials.APISECRET,
  });
  const spot = await fetchSpotWallet(client);
  const earn = await fetchEarnWallet(client2);
  const futs = await fetchFuturesWallet(client);
  const perp = await fetchPerpetualWallet(client);
  const lock = await fetchLockStacking(client2);

  const asset_map = {};
  for (const x of [spot, futs, earn, perp, lock]) {
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