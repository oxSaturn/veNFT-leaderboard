import { createPublicClient, http } from 'viem'
import { canto } from 'viem/chains'

import { getNFTs, writeMd } from './veNFT.mjs'

const veContractAddress = '0x8E003242406FBa53619769F31606ef2Ed8A65C00'

const publicClient = createPublicClient({
  chain: canto,
  transport: http(),
})

const data = await getNFTs(publicClient, veContractAddress)

writeMd(data, 'veFlow.md', 'canto')
