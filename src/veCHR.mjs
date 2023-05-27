import { createPublicClient, http } from 'viem'
import { arbitrum } from 'viem/chains'

import { getNFTs, writeMd } from './veNFT.mjs'

const veContractAddress = '0x9A01857f33aa382b1d5bb96C3180347862432B0d'

const publicClient = createPublicClient({
  chain: arbitrum,
  transport: http(),
})

const data = await getNFTs(publicClient, veContractAddress)

writeMd(data, 'veCHR.md', 'arb')
