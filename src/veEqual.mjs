import { createPublicClient, http } from 'viem'
import { fantom } from 'viem/chains'

import { getNFTs, writeMd } from './veNFT.mjs'

// veEqual
const veContractAddress = '0x8313f3551c4d3984ffbadfb42f780d0c8763ce94'

const publicClient = createPublicClient({
  chain: fantom,
  transport: http('https://rpc.fantom.network'),
})

const data = await getNFTs(publicClient, veContractAddress)

writeMd(data, 'veEqual.md', 'ftm')
