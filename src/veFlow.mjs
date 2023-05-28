import { cantoPublicClient, getNFTs, writeMd } from './veNFT.mjs'

const veContractAddress = '0x8E003242406FBa53619769F31606ef2Ed8A65C00'

const data = await getNFTs(cantoPublicClient, veContractAddress)

writeMd(data, 'veFlow.md', 'canto')
