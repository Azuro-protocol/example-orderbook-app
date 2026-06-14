'use client'
import { BscImportedMarkets, GameInfo } from '@/components'
import { LoadingGameInfo } from '@/components/Loading'
import { GameInfoNotFound } from '@/components/NotFound'
import { BetSuccessNoti } from '@/components/Noti'
import { useBscGame } from '@/hooks'
import type { GameQuery } from '@azuro-org/toolkit'
import { useParams } from 'next/navigation'

export default function Game() {
  const params = useParams()
  const { data: game, isLoading: loading } = useBscGame(params.id as string)

  if (loading) {
    return <LoadingGameInfo />
  }

  if (!game) {
    return <GameInfoNotFound />
  }

  return (
    <>
      <BetSuccessNoti />
      <GameInfo game={game as unknown as GameQuery['games'][0]} />
      <BscImportedMarkets game={game} />
    </>
  )
}
