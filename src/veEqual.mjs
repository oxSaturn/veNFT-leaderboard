import { createPublicClient, http } from 'viem'
import { fantom } from 'viem/chains'

import { abi } from './abi.mjs'
import { getNFTs, writeMd } from './veNFT.mjs'

// veEqual
const veContractAddress = '0x8313f3551c4d3984ffbadfb42f780d0c8763ce94'

const publicClient = createPublicClient({
  chain: fantom,
  transport: http('https://rpc.fantom.network'),
})

const veContract = {
  address: veContractAddress,
  abi,
}

const data = await getNFTs(publicClient, veContract)

writeMd(data, 'veEqual.md', 'ftm')
