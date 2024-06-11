require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },

    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
    // testnet: {
    //   url: "https://data-seed-prebsc-1-s1.binance.org:8545",
    //   accounts: [`0x${process.env.TESTNET_PRIVATE_KEY}`]
    // }
  }
};