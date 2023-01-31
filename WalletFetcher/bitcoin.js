// https://api.blockcypher.com/v1/btc/main/addrs/bc1qhm4f3rg7geyajcy5w85c760nr7jqg8xnu5s6n8/balance

const axios = require('axios').default;
const URL = 'https://api.blockcypher.com/v1/btc/main/addrs';
const decimal = 10**8;

async function walletFetcher(credentials) {
  const res = await axios.get(`${URL}/${credentials.address}/balance`);
  return [{
    asset: 'BTC',
    size: +res.data.balance / decimal,
    wallet: 'bitcoin',
  }];
}

module.exports = walletFetcher;