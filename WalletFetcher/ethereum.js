const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.ankr.com/eth'));

const minABI = [{
  constant: true,
  outputs: [{ name: 'balance', type: 'uint256' }],
  inputs: [{ name: '_owner', type: 'address' }],
  name: 'balanceOf',
  type: 'function',
}];
const tokens = [{
  name: 'USDC',
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  decimal: 10**6,
}];

async function walletFetcher(credentials) {
  const balances = [];
  const x = await web3.eth.getBalance(credentials.address);
  balances.push({
    asset: 'ETH',
    size: +web3.utils.fromWei(x, 'ether'),
    wallet: 'ethereum',
  });

  for (const token of tokens) {
    const contract = new web3.eth.Contract(minABI, token.address);
    const result = await contract.methods.balanceOf(credentials.address).call();
    const x = web3.utils.toBN(result) / token.decimal;
    balances.push({
      asset: token.name,
      size: +x,
      wallet: 'ethereum',
    });
  }

  return balances;
}

module.exports = walletFetcher;