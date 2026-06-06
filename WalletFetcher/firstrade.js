const fs = require('fs');
const { FTSession, FTAccountData, SymbolQuote } = require('firstrade-api-node');

async function walletFetcher(credentials) {
  const cache_filename = `./caches/firstrade-cache-${credentials.id}.json`;

  // Check cache: read from cache if market is closed AND cache is less than 1 hour old
  if (fs.existsSync(cache_filename)) {
    const stats = fs.statSync(cache_filename);
    const now = new Date();
    const cacheAgeMs = now - stats.mtime;
    const isCacheFresh = cacheAgeMs < 60 * 60 * 1000; // 1 hour

    // Market hours: 9:30 AM - 4:00 PM EST, Mon-Fri
    const estTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const day = estTime.getDay();
    const hour = estTime.getHours();
    const minute = estTime.getMinutes();
    const isMarketOpen = (day >= 1 && day <= 5) && 
                         ((hour === 9 && minute >= 30) || (hour > 9 && hour < 16));

    if (!isMarketOpen && isCacheFresh) {
      console.log(`Market closed and cache fresh for ${credentials.id}. Returning cache.`);
      return JSON.parse(fs.readFileSync(cache_filename));
    }
  }

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
        price: parseFloat(item.last),
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
