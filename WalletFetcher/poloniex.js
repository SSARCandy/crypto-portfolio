const axios = require('axios').default;
const crypto = require('crypto');

async function walletFetcher(credentials) {
  const timestamp = Date.now();
  const signStr = `GET\n/accounts/balances\nsignTimestamp=${timestamp}`;

  const sign = crypto.createHmac('sha256', credentials.APISECRET).update(signStr).digest('base64');
  const res = await axios.get('https://api.poloniex.com/accounts/balances', {
    headers: {
      'Content-Type': 'application/json',
      'key': credentials.APIKEY,
      'signature': sign,
      'signTimestamp': timestamp,
    },
  });

  const result = res.data[0].balances.map(x => ({
    asset: x.currency,
    size: (+x.available) + (+x.hold),
    wallet: 'poloniex',
  }));

  return result;
}

module.exports = walletFetcher;