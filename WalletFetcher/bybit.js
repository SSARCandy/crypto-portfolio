const _ = require('lodash');
const axios = require('axios').default;
const crypto = require('crypto');

async function derivative_account(credentials) {
  const timestamp = Date.now();
  const query_string = `api_key=${credentials.APIKEY}&timestamp=${timestamp}`;
  const sign = crypto.createHmac('sha256', credentials.APISECRET).update(query_string).digest('hex');
  const { data } = await axios.get('https://api.bybit.com/v2/private/wallet/balance', {
    params: {
      api_key: credentials.APIKEY,
      timestamp,
      sign,
    },
  });
  return data.result;
}

async function spot_account(credentials) {
  const timestamp = Date.now();
  const query_string = `api_key=${credentials.APIKEY}&timestamp=${timestamp}`;
  const sign = crypto.createHmac('sha256', credentials.APISECRET).update(query_string).digest('hex');
  const { data } = await axios.get('https://api.bybit.com/spot/v1/account', {
    params: {
      api_key: credentials.APIKEY,
      timestamp,
      sign,
    },
  });
  return _.keyBy(data.result.balances, 'coin');
}

async function walletFetcher(credentials) {
  const result_map = {};
  const perp_wallet = await derivative_account(credentials);
  const spot_wallet = await spot_account(credentials);

  for (const wallet of [perp_wallet, spot_wallet]) {
    for (const [ k, v ] of Object.entries(wallet)) {
      const size = _.get(v, 'wallet_balance', _.get(v, 'total', 0));
      result_map[k] = +size;
    }
  }
  
  return Object.entries(result_map).map(([k, v]) => ({
    asset: k,
    size: v,
    wallet: 'bybit',
  })).filter(x => x.size > 0);
}

module.exports = walletFetcher;