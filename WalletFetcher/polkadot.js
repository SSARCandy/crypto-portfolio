const { ApiPromise, WsProvider } = require('@polkadot/api');

const tokenDecimals = 10;
async function walletFetcher(credentials) {
  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });
  const { data } = await api.query.system.account(credentials.address);
  const { free, reserved } = data;
  const balance = ((+free) + (+reserved)) / (10 ** tokenDecimals);
  await api.disconnect();

  return [{
    asset: 'DOT',
    size: balance,
    wallet: 'polkadot',
  }];
}

module.exports = walletFetcher;
