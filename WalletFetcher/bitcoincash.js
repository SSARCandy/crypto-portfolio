const axios = require('axios').default;

// Bitcore public API - no API key required
// Response: { confirmed, unconfirmed, balance } in satoshis
const URL = 'https://api.bitcore.io/api/BCH/mainnet/address';
const decimal = 10 ** 8;

async function walletFetcher(credentials) {
  const address = credentials.address;
  const res = await axios.get(`${URL}/${address}/balance`, {
    timeout: 10000,
  });
  return [{
    asset: 'BCH',
    size: res.data.confirmed / decimal,
    wallet: 'bitcoincash',
  }];
}

module.exports = walletFetcher;
