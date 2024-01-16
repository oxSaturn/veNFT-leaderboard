import { fantomPublicClient, getNFTs, writeMd } from './veNFT.mjs'

const veContractAddress = '0xAE459eE7377Fb9F67518047BBA5482C2F0963236'

const data = await getNFTs(fantomPublicClient, veContractAddress)

writeMd(data, 'veFVM.md', 'ftm')
