import { chainsData, setupContracts } from '@azuro-org/toolkit'
import { bscTestnet } from 'viem/chains'

export const BSC_TESTNET_CHAIN_ID = bscTestnet.id

export const BSC_MARKET_MANAGER_API_BASE =
  process.env.NEXT_PUBLIC_BSC_MARKET_MANAGER_API_BASE ||
  'https://azuro-bsc-market-manager.dappweb.workers.dev/api/v1/public'

export const BSC_MARKET_MANAGER_ADMIN_API_BASE =
  BSC_MARKET_MANAGER_API_BASE.replace('/api/v1/public', '/api/v1/admin')

export const BSC_TESTNET_RPC_URL =
  process.env.NEXT_PUBLIC_BSC_TESTNET_RPC_URL ||
  'https://bsc-testnet-rpc.publicnode.com'

export const BSC_TESTNET_CONTRACTS = {
  lp: '0x54f43e8383F12AFaB4c4bE466054217b5D80Bd9a',
  prematchCore: '0x9dC49b3911B79D24DE5A98640c2E18E285F3D829',
  prematchComboCore: '0x9dC49b3911B79D24DE5A98640c2E18E285F3D829',
  proxyFront: '0xF1486079CdfBBae3f9E03CA56B311ceDF3d2DA63',
} as const

export const BSC_TESTNET_BET_TOKEN = {
  address: '0xC636d58d45557378117236790922522652807838',
  symbol: 'USDT',
  decimals: 18,
} as const

export function registerBscTestnetChain() {
  const registry = chainsData as Record<number, unknown>

  if (registry[BSC_TESTNET_CHAIN_ID]) {
    return
  }

  registry[BSC_TESTNET_CHAIN_ID] = {
    chain: bscTestnet,
    graphql: {
      prematch:
        'https://thegraph.onchainfeed.org/subgraphs/name/azuro-protocol/azuro-api-bsc-dev-v3',
      live: 'https://thegraph.onchainfeed.org/subgraphs/name/azuro-protocol/azuro-api-live-data-feed-dev',
    },
    socket:
      'wss://azuro-bsc-market-manager.dappweb.workers.dev/api/v1/public/streams',
    api: BSC_MARKET_MANAGER_API_BASE,
    environment: 'BscDevUSDT',
    contracts: setupContracts(BSC_TESTNET_CONTRACTS),
    betToken: BSC_TESTNET_BET_TOKEN,
  }
}
