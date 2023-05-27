import { formatUnits } from 'viem'
import { parseAbiItem } from 'viem'
import fs from 'node:fs'

const chunkSize = 2000n
// a function search for all the logs of a specific event
// note that we can all search chunkSize blocks every time
// so we need to do it multiple times to get all the logs
async function getMaxNFTId(publicClient, veContractAddress, toBlock) {
  if (!toBlock) {
    toBlock = await publicClient.getBlockNumber()
  }
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
}

export async function getNFTs(publicClient, veContract) {
  const maxNFTId = await getMaxNFTId(publicClient, veContract.address)
  // generate a multicall with all the calls you want to make
  // generate an array of maxNFTNumber length, and fill with number beginning at 1
  const nfts = [...Array(maxNFTId).keys()].map((nft) => nft + 1)
  const balances = await publicClient.multicall({
    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
    contracts: nfts.map((nft) => ({
      ...veContract,
      functionName: 'balanceOfNFT',
      args: [nft],
    })),
    allowFailure: false,
  })

  const owners = await publicClient.multicall({
    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
    contracts: nfts.map((nft) => ({
      ...veContract,
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
    .filter((x) => x.balance !== '0')
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
        value,
      ])
      return acc
    }, [])
}

export function writeMd(data, fileName, chain) {
  fs.writeFileSync(
    fileName,
    `
  | Rank | Owner | Voting Power | NFTs Id |
  | --- | --- | --- | --- |
  ${data
    .map(
      ([owner, balance, nfts], index) =>
        `| ${
          index + 1
        } | [${owner}](https://debank.com/profile/${owner}?chain=${chain}) | ${balance.toLocaleString(
          'en-US'
        )} | ${nfts.map((nft) => nft.id).join(', ')} |`
    )
    .join('\n')}`
  )
  console.log(`File ${fileName} written`)
}
