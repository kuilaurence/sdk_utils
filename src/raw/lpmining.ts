export const lpmining = [{"inputs":[{"internalType":"address","name":"_etToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"uint256","name":"weight","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"}],"name":"AddLpToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_oldImpl","type":"address"},{"indexed":true,"internalType":"address","name":"_newImpl","type":"address"}],"name":"ImplChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"lp","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Remove","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"lp","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Stake","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"uint256","name":"weight","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"}],"name":"UpdateLpToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"lp","type":"address"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"ETLastBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ETRewardPerShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"LpOfPid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TotalWeight","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"lpToken","type":"address"},{"internalType":"uint256","name":"weight","type":"uint256"}],"name":"addPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"pid","type":"uint256"},{"internalType":"address","name":"userAddress","type":"address"}],"name":"calculateLpIncome","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"pid","type":"uint256"}],"name":"currenSingePoolETBlockRewardShare","outputs":[{"internalType":"uint256","name":"_etReward","type":"uint256"},{"internalType":"uint256","name":"_etPreShare","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentAllPoolETBlockRewardShare","outputs":[{"internalType":"uint256","name":"_etReward","type":"uint256"},{"internalType":"uint256","name":"_etPreShare","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"etToken","outputs":[{"internalType":"contract ETToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"pid","type":"uint256"}],"name":"getPoolInfo","outputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_lpToken","type":"address"},{"internalType":"uint256","name":"_weight","type":"uint256"},{"internalType":"uint256","name":"_rewardPerShare","type":"uint256"},{"internalType":"uint256","name":"_ETReward","type":"uint256"},{"internalType":"uint256","name":"_ETLastBlock","type":"uint256"},{"internalType":"uint256","name":"_ETDebt","type":"uint256"},{"internalType":"uint256","name":"_totalAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPoolInfos","outputs":[{"internalType":"uint256","name":"length","type":"uint256"},{"internalType":"uint256[]","name":"_pid","type":"uint256[]"},{"internalType":"address[]","name":"_lpToken","type":"address[]"},{"internalType":"uint256[]","name":"_weight","type":"uint256[]"},{"internalType":"uint256[]","name":"_ETLastBlock","type":"uint256[]"},{"internalType":"uint256[]","name":"_totalAmount","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"pid","type":"uint256"},{"internalType":"address","name":"userAddress","type":"address"}],"name":"getUserInfo","outputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_debt","type":"uint256"},{"internalType":"uint256","name":"_reward","type":"uint256"},{"internalType":"uint256","name":"_totalIncome","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"impl","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfos","outputs":[{"internalType":"uint256","name":"pid","type":"uint256"},{"internalType":"address","name":"lpToken","type":"address"},{"internalType":"uint256","name":"weight","type":"uint256"},{"internalType":"uint256","name":"rewardPerShare","type":"uint256"},{"internalType":"uint256","name":"ETReward","type":"uint256"},{"internalType":"uint256","name":"ETLastBlock","type":"uint256"},{"internalType":"uint256","name":"ETDebt","type":"uint256"},{"internalType":"uint256","name":"totalAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"pid","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"removeLp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"pid","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stackLp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"lpToken","type":"address"},{"internalType":"uint256","name":"weight","type":"uint256"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newImpl","type":"address"}],"name":"upgradeImpl","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfos","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"debt","type":"uint256"},{"internalType":"uint256","name":"reward","type":"uint256"},{"internalType":"uint256","name":"totalIncome","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"pid","type":"uint256"}],"name":"withdrawIncome","outputs":[],"stateMutability":"nonpayable","type":"function"}]