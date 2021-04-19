export const chainIdDict = {
  1: "Ethereum",
  3: "Ropsten",
  4: "Rinkeby",
  5: "Goerli",
  42: "Kovan",
  56: "BSC",
  97: "BSCTest",
  128: "HECO",
};

export const userInfo: { account: string, chainID: 97 | 128, chain: "BSCTest" | "HECO" } = {
  account: "",
  chainID: 97,
  chain: "BSCTest",
};

//每次部署需要配置,对应合约地址
export const ContractAddress = {
  97: {
    mdexFactoryContract: "0x0C69B5eBcC55CDeDe930607CC8c85DBC3cC60399",
    mdexRouterContract: "0x5334adA1e86bd323370eAc71702D20d8bA4ef3a5",
    mdexPoolContract: "0xad8a3029743c71d1Ea487BFE51D9ccDB7B4c032d",
    recommend: "0xcA30AEeF1F37904576F56440A88C1755878f631b",
    lpMining: "0xD796B382AC236d410E1809aC1D45E044Ad19760f",
    exchangeToken: "0x8015b3DEaa91581246BDb27b6fAB3f89ad1114bF",
    pledgeMining: "0x111847C9410feF5A66aDD413414fB5130A5A8720",
    teamMining: "0xBe98dD4B4C76dd24802Fcb70Df6b5A748F0b3C62",
    inviteReward: "0xb86F776d2d6A548397fE05b1D6B126C098890cFF",
    nodeMining: "0x8c438620abA8E5759e7128F030881ccc6050A8CA",
    etQuery: "0xB7cE8aB9eA4017B5e299C35491a69D5e34bd1777",
  },
  128: {
    mdexFactoryContract: "0xb0b670fc1f7724119963018db0bfa86adb22d941",
    mdexRouterContract: "0x5334adA1e86bd323370eAc71702D20d8bA4ef3a5",
    mdexPoolContract: "0xad8a3029743c71d1Ea487BFE51D9ccDB7B4c032d",
    recommend: "0xFfc78d708c478a75f1a0d0cd6889940eC141A51f",
    lpMining: "0x5eC89A19896576fbeFAec2a677008510E7490b72",
    exchangeToken: "0x4D044Eaa84643DeC57731B37D53BB12CbD277EDb",
    pledgeMining: "0x85878b61c20C145b470a162094FD4ad21f0B1267",
    teamMining: "0x2687D7c59e4bAc280a23d8223e539D36fCc4b2b8",
    inviteReward: "0x2EF20B723A777048F7F350a9B23DC861102de071",
    nodeMining: "0xb0794D97E60eC7B62b6f1B4c49EE00Cd6c446D98",
    etQuery: "0x20292b2D33A5632a44b3D00FeB30d687E112192F",
  },
};

//每次部署需要配置,普通币的地址
export const tokenAddres = {
  97: {
    USDT: "0x87536A0e7f0867f0D92FFc48bDC2164d48Cd45C5",
    WETH: "0xD57E4cf9654c8aBBe9e5cE6dEE0A0Cb7F79C8a94",
    ETHST: "0x9e00Ff6cC8a89FD0Ec30DCB38aBDD1Bea5A1ac78",
    ET: "0x91700568091DE9ff42de68500624c3CFd5F18B19",
    ETUSDT: "0xAa4f059060314F88d82596E02a5eF4fEb78928c9",
    ETHSTUSDT: "0xFCb36424f74E18422507e7CA1b7e3109BcB8d3d7",
  },
  128: {
    USDT: "0xa71edc38d189767582c38a3145b5873052c3e47a",
    WETH: "0x64ff637fb478863b7468bc97d30a5bf3a428a1fd",
    ETHST: "0x7E47837BBCB61D9675C66e6e64c6b307E5687F3A",
    ET: "0x32c09806C0d1064b74700c98B3DEE73d41f48Edf",
    ETUSDT: "0x6da00728fe510cdc7176987D0d67ed1B7df9f802",
    ETHSTUSDT: "0x26e8Fc70db2A62F8c04689b6245B659aE940EBA2",
  },
};