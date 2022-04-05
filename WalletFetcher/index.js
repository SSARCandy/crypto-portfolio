const factory = {
  'binance': require('./binance'),
  'whalefin': require('./whalefin'),
};

/**
 * Return balances of a wallet
 * @param {*} WalletType Binance, Whalefin, FTX, ...
 * @param {*} credentials Credentials of the wallet
 * @returns Array of balances
 * [
 *  {"size": 0.1, "asset": "BTC", "wallet": "binance"},
 *  ...
 * ]
 */
function UniversalWalletFetcher(wallet, credentials) {
  if (!factory[wallet]) {
    console.error(`${wallet} is not supported`);
    return [];
  }
  return factory[wallet](credentials);
}

module.exports = {
  UniversalWalletFetcher,
};