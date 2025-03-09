import { lineaPublicClient, getNFTs, writeMd } from './veNFT.mjs'

const veContractAddress = '0xAAAEa1fB9f3DE3F70E89f37B69Ab11B47eb9Ce6F'

const data = await getNFTs(lineaPublicClient, veContractAddress, 1024n)

writeMd(data, 'veNile.md', 'linea')
