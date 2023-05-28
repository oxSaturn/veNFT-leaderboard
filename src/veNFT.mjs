import { createPublicClient, formatUnits, http } from 'viem'
import { parseAbiItem } from 'viem'
import fs from 'node:fs'
import { abi } from './abi.mjs'
import { arbitrum, canto, fantom } from 'viem/chains'

export const arbitrumPublicClient = createPublicClient({
  chain: arbitrum,
  transport: http(undefined, {
    // might run into rate limiting issues
    // {"code":429,"message":"Public RPC Rate Limit Hit, limit will reset in 60 seconds"}
    retryDelay: 60_000,
  }),
})

export const cantoPublicClient = createPublicClient({
  chain: canto,
  transport: http('https://mainnode.plexnode.org:8545'),
})

export const fantomPublicClient = createPublicClient({
  chain: fantom,
  transport: http('https://rpc.fantom.network'),
})

const chunkSize = 1024n
// a function search for all the logs of a specific event
// note that we can all search chunkSize blocks every time
// so we need to do it multiple times to get all the logs
async function getMaxNFTId(publicClient, veContractAddress, toBlock) {
  if (!toBlock) {
    toBlock = await publicClient.getBlockNumber()
    console.log('blockNumber', toBlock)
  }
  try {
    const fromBlock = toBlock - chunkSize

    const logs = await publicClient.getLogs({
      address: veContractAddress,
      event: parseAbiItem(
        'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
      ),
      args: {
        from: '0x0000000000000000000000000000000000000000',
      },
      toBlock: toBlock,
      fromBlock,
    })
    if (logs.length === 0) {
      if (fromBlock === 0n) {
        return 0
      }
      return await getMaxNFTId(
        publicClient,
        veContractAddress,
        fromBlock - chunkSize
      )
    } else {
      return Number(logs[logs.length - 1].args.tokenId)
    }
  } catch (err) {
    console.log('something wrong', err)
    // // sleep 1 min
    // await new Promise((resolve) => setTimeout(resolve, 60000))
    // // retry
    // return await getMaxNFTId(publicClient, veContractAddress, toBlock)
  }
}

export async function getNFTs(publicClient, veContractAddress) {
  const maxNFTId = await getMaxNFTId(publicClient, veContractAddress)
  console.log('maxNFTId', maxNFTId)
  // generate a multicall with all the calls you want to make
  // generate an array of maxNFTNumber length, and fill with number beginning at 1
  const nfts = [...Array(maxNFTId).keys()].map((nft) => nft + 1)
  const [totalSupply, ...balances] = await publicClient.multicall({
    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
    contracts: [
      {
        address: veContractAddress,
        abi: abi,
        functionName: 'totalSupply',
        args: [],
      },
      ...nfts.map((nft) => ({
        address: veContractAddress,
        abi: abi,
        functionName: 'balanceOfNFT',
        args: [nft],
      })),
    ],
    allowFailure: false,
  })

  const owners = await publicClient.multicall({
    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
    contracts: nfts.map((nft) => ({
      address: veContractAddress,
      abi: abi,
      functionName: 'ownerOf',
      args: [nft],
    })),
    allowFailure: false,
  })

  const data = nfts
    .map((nft, index) => ({
      id: nft,
      balance: formatUnits(balances[index], 18),
      owner: owners[index],
    }))
    .reduce((acc, obj) => {
      acc[obj.owner] = acc[obj.owner] || []
      acc[obj.owner].push(obj)
      return acc
    }, {})
  return Object.entries(data)
    .sort((a, b) => {
      const aTotal = a[1].reduce((acc, obj) => acc + Number(obj.balance), 0)
      const bTotal = b[1].reduce((acc, obj) => acc + Number(obj.balance), 0)
      return bTotal - aTotal
    })
    .reduce((acc, [key, value]) => {
      acc.push([
        key,
        // sum all balances
        value.reduce((acc, obj) => acc + Number(obj.balance), 0),
        // influence
        value.reduce((acc, obj) => acc + Number(obj.balance), 0) /
          Number(formatUnits(totalSupply, 18)),
        value,
      ])
      return acc
    }, [])
}

export function writeMd(data, fileName, chain) {
  fs.writeFileSync(
    fileName,
    `## ${fileName.replace('.md', '')}

Total Owners: ${data.length}, Total NFTs: ${data.reduce(
      (acc, [_, __, ___, nfts]) => acc + nfts.length,
      0
    )}

| Rank | Owner | Voting Power | Influence | NFTs Id |
| --- | --- | --- | --- | --- |
  ${data
    .map(
      ([owner, balance, influence, nfts], index) =>
        `| ${
          index + 1
        } | [${owner}](https://debank.com/profile/${owner}?chain=${chain}) | ${balance.toLocaleString(
          'en-US'
        )} | ${(influence * 100).toFixed(5)}% | ${nfts
          .map((nft) => nft.id)
          .join(', ')} |`
    )
    .join('\n')}`
  )
  console.log(`File ${fileName} written`)
}
