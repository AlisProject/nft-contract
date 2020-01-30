const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  networks: {
    live: {
      provider: () => new HDWalletProvider(process.env.PRIVATE_KEY, process.env.ENDPOINT_URL),
      network_id: 1,
      gas: 5500000,
      gasPrice: 6000000000, // 6gwei
      timeoutBlocks: 200
    },

    ropsten: {
      provider: () => new HDWalletProvider(process.env.PRIVATE_KEY, process.env.ENDPOINT_URL),
      network_id: 3,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },

  mocha: {},

  compilers: {
    solc: {}
  }
}