import { getDefaultConfig, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { bscTestnet } from 'viem/chains'
import { http } from 'wagmi'
import { BSC_TESTNET_RPC_URL, registerBscTestnetChain } from './bsc'

registerBscTestnetChain()

const { wallets } = getDefaultWallets()

const chains = [bscTestnet] as const

const wagmiConfig = getDefaultConfig({
  appName: 'Azuro',
  projectId: '2f82a1608c73932cfc64ff51aa38a87b', // get your own project ID - https://cloud.walletconnect.com/sign-in
  wallets,
  chains,
  transports: {
    [bscTestnet.id]: http(BSC_TESTNET_RPC_URL),
  },
  ssr: false,
})

export default wagmiConfig
