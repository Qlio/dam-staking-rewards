import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {},
    blast: {
      url: "https://rpc.ankr.com/blast",
      accounts: [""],
    },
  },
  etherscan: {
    apiKey: "",
    customChains: [
      {
        network: "blast",
        chainId: 81457,
        urls: {
          apiURL: "https://api.blastscan.io/api",
          browserURL: "https://blastscan.io",
        },
      },
    ],
  },
};

export default config;
