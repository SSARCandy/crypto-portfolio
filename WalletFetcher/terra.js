const { AnchorEarn, CHAINS, NETWORKS, DENOMS } = require('@anchor-protocol/anchor-earn');

async function walletFetcher(credentials) {
  const anchorEarn = new AnchorEarn({
    chain: CHAINS.TERRA,
    network: NETWORKS.COLUMBUS_5,
    address: credentials.address,
  });
  
  const userBalance = await anchorEarn.balance({
    currencies: [DENOMS.UST],
  });
  const result = userBalance.balances.map(x => ({
    asset: x.currency,
    size: (+x.account_balance) + (+x.deposit_balance),
    wallet: 'terra',
  }));

  return result;
}

module.exports = walletFetcher;