'use client'
import { OutComeData } from '@/hooks'
import type { BscGame, BscNavigationSport } from '@/services/bscMarketManager'
import { DefaultBetRanges, TCategory } from '@/types'
import { SportHub } from '@azuro-org/sdk'
import { MarketOutcome, SportsNavigationQuery, GamesQuery } from '@azuro-org/toolkit'
import { Dispatch, SetStateAction, createContext } from 'react'

export type ExploreContextValue = {
  sportHub: SportHub,
  sportSlug: string
  sportsLoading: boolean
  gamesLoading: boolean
  games: GamesQuery['games'] | BscGame[] | undefined
  sports: SportsNavigationQuery['sports'] | BscNavigationSport[] | undefined
  categories: TCategory[]
  searching: string
  bets: OutComeData
  allBets: OutComeData
  betRange: DefaultBetRanges
  setBets: Dispatch<SetStateAction<OutComeData>>
  setBetRange: Dispatch<SetStateAction<DefaultBetRanges>>
  filterSports: (hub: SportHub) => void
  filterGames: (slug: string) => void
  clearFilterSports: () => void
  clearFilterGames: () => void
  setSearching: (value: string) => void
  outcomeSelected: MarketOutcome | null
  setOutcomeSelected: Dispatch<SetStateAction<MarketOutcome | null>>
}

export const ExploreContext = createContext<ExploreContextValue>({
  sportHub: SportHub.Sports,
  sportSlug: '',
  sportsLoading: false,
  gamesLoading: false,
  games: [],
  sports: [],
  categories: [],
  searching: '',
  bets: {},
  allBets: {},
  betRange: 'Single',
  filterSports: () => null,
  setBets: () => null,
  setBetRange: () => null,
  filterGames: () => null,
  setSearching: () => null,
  clearFilterSports: () => null,
  clearFilterGames: () => null,
  outcomeSelected: null,
  setOutcomeSelected: () => null,
})
