import { fantomPublicClient, getNFTs, writeMd } from './veNFT.mjs'

// veEqual
const veContractAddress = '0x8313f3551c4d3984ffbadfb42f780d0c8763ce94'

const data = await getNFTs(fantomPublicClient, veContractAddress)

writeMd(data, 'veEqual.md', 'ftm')
