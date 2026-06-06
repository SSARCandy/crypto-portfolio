const fs = require('fs');
const { FTSession, FTAccountData } = require('firstrade-api-node');

async function walletFetcher(credentials) {
  const cache_filename = `./caches/firstrade-cache-${credentials.id}.json`;

  const ftSession = new FTSession({
    username: credentials.username,
    password: credentials.password,
    mfaSecret: credentials.mfaSecret,
    saveSession: true,
  });

  const needCode = await ftSession.login();
  if (needCode) {
    throw new Error('MFA code required but not provided or automated via mfaSecret');
  }

  const ftAccounts = new FTAccountData(ftSession);
  await ftAccounts.init();

  const accountId = ftAccounts.accountNumbers[0];
  const [balanceOverview, positions] = await Promise.all([
    ftAccounts.getBalanceOverview(accountId),
    ftAccounts.getPositions(accountId),
  ]);

  const result = [];
  // Map positions
  if (positions && positions.items) {
    for (const item of positions.items) {
      result.push({
        size: parseFloat(item.quantity),
        asset: item.symbol,
        wallet: 'firstrade',
        price: parseFloat(item.last_price || item.price || 0),
      });
    }
  }

  // Add cash balance as USD
  const cash = parseFloat(balanceOverview['result.cash_balance'] || 0);
  if (cash > 0) {
    result.push({
      size: cash,
      asset: 'USD',
      wallet: 'firstrade',
      price: 1,
    });
  }

  // Save to cache
  fs.writeFileSync(cache_filename, JSON.stringify(result, null, 2));
  return result;
}

module.exports = walletFetcher;
