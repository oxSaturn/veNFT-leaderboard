import { polygonPublicClient, getNFTs, writeMd } from './veNFT.mjs'

const veContractAddress = '0xB419cE2ea99f356BaE0caC47282B9409E38200fa'

const data = await getNFTs(polygonPublicClient, veContractAddress, 1024n)

writeMd(data, 'veRetro.md', 'matic')
