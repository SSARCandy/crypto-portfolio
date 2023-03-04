const _ = require('lodash');
const axios = require('axios').default;
const crypto = require('crypto');
const { time } = require('console');

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

async function account_balance(credentials, account_type) {
  const timestamp = Date.now();
  const querystring = `accountType=${account_type}`;
  const payload = `${timestamp}${credentials.APIKEY}5000${querystring}`;
  const sign = crypto.createHmac('sha256', credentials.APISECRET).update(payload).digest('hex');
  const { data } = await axios.get(`https://api.bybit.com/v5/asset/transfer/query-account-coins-balance?${querystring}`, {
    headers: {
      'X-BAPI-API-KEY': credentials.APIKEY,
      'X-BAPI-TIMESTAMP': timestamp,
      'X-BAPI-SIGN': sign,
      'X-BAPI-RECV-WINDOW': 5000,
    },
  });
  return data.result.balance;
}

async function walletFetcher(credentials) {
  const types = [
    'CONTRACT',
    'SPOT',
    'INVESTMENT',
    'UNIFIED',
    'FUND',
  ];
  const result_map = {};
  for (const type of types) {
    const balances = await account_balance(credentials, type);
    await new Promise(r => setTimeout(r, 2000));
    for (const { coin, walletBalance } of balances) {
      const size = +walletBalance;
      if (size === 0) continue;
      result_map[coin] = result_map[coin] ? result_map[coin] + size : size;
    }
  }
  
  return Object.entries(result_map).map(([k, v]) => ({
    asset: k,
    size: v,
    wallet: 'bybit',
  })).filter(x => x.size > 0);
}

module.exports = walletFetcher;