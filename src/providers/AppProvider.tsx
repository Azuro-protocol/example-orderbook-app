'use client'
import { wagmiConfig } from '@/config'
import { ExploreProvider } from '@/providers'
import { ApolloProvider, AzuroSDKProvider } from '@azuro-org/sdk'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useMemo } from 'react'
import { WagmiProvider } from 'wagmi'
import BetslipProvider from './BetslipProvider'

const queryClient = new QueryClient()

export type AppProvidersProps = PropsWithChildren<{
  initialChainId?: string
}>

export default function AppProvider(props: Readonly<AppProvidersProps>) {
  const { children, initialChainId } = props

  const chainId = useMemo(() => {
    const defaultChainId = wagmiConfig.chains[0].id
    if (!initialChainId) return defaultChainId
    const chain = wagmiConfig.chains.find(
      (chain) => chain.id === +initialChainId
    )
    return chain ? chain.id : defaultChainId
  }, [initialChainId])

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AzuroSDKProvider
            initialChainId={chainId as never}
            isBatchBetWithSameGameEnabled
          >
            <ApolloProvider>
              <BetslipProvider>
                <ExploreProvider>{children}</ExploreProvider>
              </BetslipProvider>
            </ApolloProvider>
          </AzuroSDKProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
