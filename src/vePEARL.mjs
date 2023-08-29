import { polygonPublicClient, getNFTs, writeMd } from './veNFT.mjs'

const veContractAddress = '0x017A26B18E4DA4FE1182723a39311e67463CF633'

const data = await getNFTs(polygonPublicClient, veContractAddress, 1024n)

writeMd(data, 'vePEARL.md', 'matic')
