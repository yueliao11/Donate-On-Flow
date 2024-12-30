// hardhat.config.cjs
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@typechain/hardhat");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {}
  },
  typechain: {
    outDir: 'src/types',
    target: 'ethers-v5'
  }
};