const axios = require('axios').default;

async function walletFetcher(credentials) {
  const res = await axios.get(`https://apilist.tronscan.org/api/account?address=${credentials.address}`);

  const balance_map = {};
  for (const { tokenAbbr, tokenDecimal, balance } of res.data.tokens) {
    const token = tokenAbbr.toUpperCase();
    balance_map[token] = (+balance) / (10**tokenDecimal);
  }
  balance_map['TRX'] += res.data.voteTotal + (res.data.rewardNum / 1000000);
  const results = Object.entries(balance_map).map(([k, v]) => ({
    asset: k,
    size: v,
    wallet: 'tron',
  }));
  return results;
}

module.exports = walletFetcher;