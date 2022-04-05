const axios = require('axios').default;
const crypto = require('crypto');

async function walletFetcher(credentials) {
  const timestamp = Date.now();
  const signStr = `${timestamp}GET/api/wallet/balances`;

  const sign = crypto.createHmac('sha256', credentials.APISECRET).update(signStr).digest('hex');
  const res = await axios.get('https://ftx.com/api/wallet/balances', {
    headers: {
      'FTX-KEY': credentials.APIKEY,
      'FTX-SIGN': sign,
      'FTX-TS': timestamp,
    },
  });

  const result = res.data.result.map(x => ({
    asset: x.coin,
    size: (+x.total),
    wallet: 'ftx',
  })).filter(x => x.size > 0);
  console.log(result);

  return result;
}

module.exports = walletFetcher;