const axios = require('axios').default;

async function walletFetcher(credentials) {
  const res = await axios.get(`https://api.tzstats.com/explorer/account/${credentials.address}`);
  
  return [{
    asset: 'XTZ',
    size: res.data.spendable_balance,
    wallet: 'tezos',
  }];
}

module.exports = walletFetcher;