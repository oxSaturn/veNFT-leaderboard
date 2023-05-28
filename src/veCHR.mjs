import { arbitrumPublicClient, getNFTs, writeMd } from './veNFT.mjs'

const veContractAddress = '0x9A01857f33aa382b1d5bb96C3180347862432B0d'

const data = await getNFTs(arbitrumPublicClient, veContractAddress)

writeMd(data, 'veCHR.md', 'arb')
