const axios = require('axios').default;
const crypto = require('crypto');

async function walletFetcher(credentials) {
  const timestamp = Date.now();
  const signStr = `command=returnCompleteBalances&nonce=${timestamp}`;

  const sign = crypto.createHmac('sha512', credentials.APISECRET).update(signStr).digest('hex');
  const res = await axios.post('https://poloniex.com/tradingApi', signStr, {
    headers: {
      'Key': credentials.APIKEY,
      'Sign': sign,
    },
  });

  const result = Object.entries(res.data).map(([k, v]) => ({
    asset: k,
    size: (+v.available) + (+v.onOrders),
    wallet: 'poloniex',
  })).filter(x => x.size > 0);

  return result;
}

module.exports = walletFetcher;