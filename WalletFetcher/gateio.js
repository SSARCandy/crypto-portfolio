const axios = require('axios').default;
const crypto = require('crypto');

const BASE = 'https://api.gateio.ws';
const EMPTY_HASH = 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e';

async function walletFetcher(credentials) {
  const nonce = Date.now() / 1000;
  const signStr = `GET\n/api/v4/spot/accounts\n\n${EMPTY_HASH}\n${nonce}`;
  const sign = crypto.createHmac('sha512', credentials.APISECRET).update(signStr).digest('hex');
  const res = await axios.get(`${BASE}/api/v4/spot/accounts`, {
    headers: {
      'KEY': credentials.APIKEY,
      'SIGN': sign,
      'Timestamp': nonce,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const result = res.data.map(x => ({
    asset: x.currency,
    size: (+x.available) + (+x.locked),
    wallet: 'gateio',
  }));

  return result;
}

module.exports = walletFetcher;