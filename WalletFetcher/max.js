const axios = require('axios').default;
const crypto = require('crypto');

async function walletFetcher(credentials) {
  const nonce = Date.now();
  const paramsToBeSigned = {
    nonce,
    path: '/api/v2/members/accounts',
  };
  const payload = Buffer.from(JSON.stringify(paramsToBeSigned)).toString('base64');
  const sign = crypto.createHmac('sha256', credentials.APISECRET).update(payload).digest('hex');
  const res = await axios.get(`https://max-api.maicoin.com/${paramsToBeSigned.path}?nonce=${nonce}`, {
    headers: {
      'X-MAX-ACCESSKEY': credentials.APIKEY,
      'X-MAX-PAYLOAD': payload,
      'X-MAX-SIGNATURE': sign,
      'Content-Type': 'application/json',
    },
  });
  const result = res.data.map(x => ({
    asset: x.currency.toUpperCase(),
    size: (+x.balance) + (+x.locked),
    wallet: 'max',
  })).filter(x => x.size > 0);

  return result;
}

module.exports = walletFetcher;