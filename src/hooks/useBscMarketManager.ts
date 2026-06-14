'use client'

import {
  getBscGame,
  getBscGames,
  getBscNavigation,
} from '@/services/bscMarketManager'
import { useQuery } from '@tanstack/react-query'

export function useBscNavigation() {
  return useQuery({
    queryKey: ['bsc-market-manager', 'navigation'],
    queryFn: getBscNavigation,
    refetchOnWindowFocus: false,
  })
}

export function useBscGames(sportSlug?: string, query?: string) {
  return useQuery({
    queryKey: ['bsc-market-manager', 'games', sportSlug, query],
    queryFn: () => getBscGames(sportSlug, query),
    refetchOnWindowFocus: false,
  })
}

export function useBscGame(gameId?: string) {
  return useQuery({
    queryKey: ['bsc-market-manager', 'game', gameId],
    queryFn: () => getBscGame(gameId!),
    enabled: Boolean(gameId),
    refetchOnWindowFocus: false,
  })
}
