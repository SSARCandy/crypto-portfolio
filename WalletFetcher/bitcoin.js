// https://api.blockcypher.com/v1/btc/main/addrs/bc1qhm4f3rg7geyajcy5w85c760nr7jqg8xnu5s6n8/balance

const { sum } = require('lodash');
const axios = require('axios').default;
const URL = 'https://api.blockcypher.com/v1/btc/main/addrs';
const decimal = 10**8;

async function walletFetcher(credentials) {
  const res = await axios.get(`${URL}/${credentials.address}/balance`);
  const total = sum(res.data.map(x => +x.balance));
  return [{
    asset: 'BTC',
    size: total / decimal,
    wallet: 'bitcoin',
  }];
}

module.exports = walletFetcher;
