import { getNFTs, optimismPublicClient, writeMd } from './veNFT.mjs'

// veVelo
const veContractAddress = '0x9c7305eb78a432ced5C4D14Cac27E8Ed569A2e26'

const data = await getNFTs(optimismPublicClient, veContractAddress, 1024n)

writeMd(data, 'veVelo.md', 'op')
