const fs = require('fs');

async function walletFetcher(credentials) {
  const cache_filename = `./caches/firstrade-cache-${credentials.id}.json`;
  const cache = JSON.parse(fs.readFileSync(cache_filename));
  return cache;
}

module.exports = walletFetcher;
