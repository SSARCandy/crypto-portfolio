const axios = require('axios').default;
const URL = 'https://api.fullstack.cash/v5/electrumx/balance';
const decimal = 10**8;

async function walletFetcher(credentials) {
  const res = await axios.get(`${URL}/${credentials.address}`);
  return [{
    asset: 'BCH',
    size: +res.data.balance.confirmed / decimal,
    wallet: 'bitcoincash',
  }];
}

module.exports = walletFetcher;