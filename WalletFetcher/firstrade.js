const { firstrade } = require('firstrade-cli');

async function walletFetcher(credentials) {
  const positions = await firstrade.getPosition(credentials);
  const { cashBalance } = await firstrade.getBalance(credentials);
  const result = positions.map(x => ({
    size: x.quantity,
    asset: x.symbol,
    wallet: 'firstrade',
    price: x.price, ///< special for firstrade
  }));
  result.push({
    size: cashBalance,
    asset: 'USD',
    wallet: 'firstrade',
    price: 1
  });

  return result;
}

module.exports = walletFetcher;
