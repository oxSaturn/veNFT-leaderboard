import { basePublicClient, getNFTs, writeMd } from './veNFT.mjs'

const veContractAddress = '0x91F85d68B413dE823684c891db515B0390a02512'

const data = await getNFTs(basePublicClient, veContractAddress, 2000n)

writeMd(data, 'veBVM.md', 'base')
