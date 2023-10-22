import { getNFTs, optimismPublicClient, writeMd } from './veNFT.mjs'

// veVelo v2
const veContractAddress = '0xFAf8FD17D9840595845582fCB047DF13f006787d'

const data = await getNFTs(optimismPublicClient, veContractAddress, 1024n)

writeMd(data, 'veVelo.md', 'op')
