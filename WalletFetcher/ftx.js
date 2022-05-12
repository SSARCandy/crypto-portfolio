const axios = require('axios').default;
const crypto = require('crypto');

async function walletFetcher(credentials) {
  const timestamp = Date.now();
  const signStr = `${timestamp}GET/api/wallet/all_balances`;

  const sign = crypto.createHmac('sha256', credentials.APISECRET).update(signStr).digest('hex');
  const res = await axios.get('https://ftx.com/api/wallet/all_balances', {
    headers: {
      'FTX-KEY': credentials.APIKEY,
      'FTX-SIGN': sign,
      'FTX-TS': timestamp,
    },
  });

  const asset_map = {};
  for (const k of Object.keys(res.data.result)) {
    const vs = res.data.result[k];
    for (const { coin, total } of vs) {
      asset_map[coin] = {
        asset: coin,
        size: (asset_map[coin] ? asset_map[coin].size : 0) + (+total),
      };
    }
  }

  const result = Object.values(asset_map).map((v) => ({
    ...v,
    wallet: 'ftx',
  })).filter((v) => v.size > 0);

  return result;
}

module.exports = walletFetcher;