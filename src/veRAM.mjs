import { createPublicClient, http } from 'viem'
import { arbitrum } from 'viem/chains'

import { getNFTs, writeMd } from './veNFT.mjs'

// veRAM
const veContractAddress = '0xAAA343032aA79eE9a6897Dab03bef967c3289a06'

const publicClient = createPublicClient({
  chain: arbitrum,
  transport: http(),
})

const data = await getNFTs(publicClient, veContractAddress)

writeMd(data, 'veRAM.md', 'arb')
