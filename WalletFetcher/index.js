const factory = {
  'binance': require('./binance'),
  'whalefin': require('./whalefin'),
  // 'ftx': require('./ftx'),
  'poloniex': require('./poloniex'),
  'gateio': require('./gateio'),
  'bybit': require('./bybit'),
  'max': require('./max'),
  // 'terra': require('./terra'),
  // 'tezos': require('./tezos'),
  'polkadot': require('./polkadot'),
  'tron': require('./tron'),
  'ethereum': require('./ethereum'),
  'bitcoin': require('./bitcoin'),
  'bitcoincash': require('./bitcoincash'),
  'ibkr': require('./ibkr'),
  'firstrade': require('./firstrade'),
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
async function UniversalWalletFetcher(wallet, credentials) {
  if (!factory[wallet]) {
    console.error(`${wallet} is not supported`);
    return [];
  }
  try {
    return await factory[wallet](credentials);
  } catch (err) {
    console.log(`>>>>> ${wallet} ${credentials.id} encounter error. <<<<<`);
	  console.log(err)
    return [
      { 'size': -1, 'asset': 'APP_ERROR', 'wallet': wallet },
    ];
  }
}

module.exports = {
  UniversalWalletFetcher,
  WALLETS: Object.keys(factory),
};
