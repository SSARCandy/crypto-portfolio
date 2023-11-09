const axios = require('axios').default;
const KEY = 'MIZAH9G49FW4Z63PC84TCU4PDHJ2RQR';

async function walletFetcher(credentials) {
  const res = await axios.get(`https://api.tzpro.io/explorer/account/${credentials.address}?api_key=${KEY}`);
  
  return [{
    asset: 'XTZ',
    size: res.data.spendable_balance,
    wallet: 'tezos',
  }];
}

module.exports = walletFetcher;