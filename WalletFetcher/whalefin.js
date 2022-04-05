const axios = require('axios').default;
const crypto = require('crypto');

async function walletFetcher(credentials) {
  const timestamp = Date.now();
  const signStr = `method=GET&path=/api/v2/asset/balance&timestamp=${timestamp}`;

  const sign = crypto.createHmac('sha256', credentials.APISECRET).update(signStr).digest('hex');
  const res = await axios.get('https://be.whalefin.com/api/v2/asset/balance', {
    headers: {
      'access-key': credentials.APIKEY,
      'access-timestamp': timestamp,
      'access-sign': sign,
    },
  });
  const result = res.data.result.balanceDetails.map(x => ({
    asset: x.ccy,
    size: (+x.availableBalance) + (+x.dualCurrencyLockedAmount) + (+x.earnLockedAmount),
    wallet: 'whalefin',
  }));
  return result;
}

module.exports = walletFetcher;