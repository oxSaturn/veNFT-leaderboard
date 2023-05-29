import { bnbPublicClient, getNFTs, writeMd } from './veNFT.mjs'

const veContractAddress = '0xfbbf371c9b0b994eebfcc977cef603f7f31c070d'

const data = await getNFTs(bnbPublicClient, veContractAddress)

writeMd(data, 'veTHE.md', 'bsc')
