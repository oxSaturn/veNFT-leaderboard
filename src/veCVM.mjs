import { cantoPublicClient, getNFTs, writeMd } from './veNFT.mjs'

const veContractAddress = '0xA1B589FB7e04d19CEC391834131158f7F9d2D168'

const data = await getNFTs(cantoPublicClient, veContractAddress)

writeMd(data, 'veCVM.md', 'canto')
