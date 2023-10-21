import { basePublicClient, getNFTs, writeMd } from './veNFT.mjs'

const veContractAddress = '0x28c9C71c776a1203000B56C0Cca48BEf1cd51C53'

const data = await getNFTs(basePublicClient, veContractAddress, 2000n)

writeMd(data, 'veSCALE.md', 'base')
