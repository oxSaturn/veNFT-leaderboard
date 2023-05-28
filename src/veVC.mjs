import { getNFTs, writeMd, zkSyncPublicClient } from './veNFT.mjs'

const veContractAddress = '0xbdE345771Eb0c6adEBc54F41A169ff6311fE096F'

const data = await getNFTs(zkSyncPublicClient, veContractAddress)

writeMd(data, 'veVC.md', 'era')
