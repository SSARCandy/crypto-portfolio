const axios = require('axios').default;
const https = require('https');

const URL = 'https://bch.fullstack.cash/v6/fulcrum/balance';
const decimal = 10**8;

const httpsAgent = new https.Agent({  
  rejectUnauthorized: false
});
async function walletFetcher(credentials) {
  const res = await axios.get(`${URL}/${credentials.address}`, {
    httpsAgent,
  });
  return [{
    asset: 'BCH',
    size: +res.data.balance.confirmed / decimal,
    wallet: 'bitcoincash',
  }];
}

module.exports = walletFetcher;
