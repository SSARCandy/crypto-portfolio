const { firstrade } = require('firstrade-cli');
const fs = require('fs');

async function walletFetcher(credentials) {
  const cache_filename = `firstrade-cache-${credentials.id}.json`;
  const now = new Date();
  if (now.getHours() < 14 || now.getHours() > 15) {
    const cache = JSON.parse(fs.readFileSync(cache_filename));
    return cache;
  }

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
    price: 1,
  });
  fs.writeFileSync(cache_filename, JSON.stringify(result));

  return result;
}

module.exports = walletFetcher;
