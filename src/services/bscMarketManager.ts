import { BSC_MARKET_MANAGER_API_BASE } from '@/config/bsc'

export type BscParticipant = {
  image: string | null
  name: string
}

export type BscGame = {
  id: string
  gameId: string
  slug: string
  title: string
  startsAt: string
  state: 'Prematch' | 'Live' | 'Finished' | 'Stopped' | 'Canceled'
  status: 'Created' | 'Resolved' | 'Canceled' | 'Paused'
  turnover: string
  sport: {
    sportId: string
    slug: string
    name: string
    sporthub?: {
      id: string
      slug: 'sports' | 'esports'
    }
  }
  country: {
    id: string
    slug: string
    name: string
  }
  league: {
    id: string
    slug: string
    name: string
    country: {
      id: string
      slug: string
      name: string
    }
  }
  participants: BscParticipant[]
  conditions: Array<{
    conditionId: string
    coreAddress: string
    lpAddress: string
    oracleAddress: string
    txHash: string | null
    status: 'Created' | 'Resolved' | 'Canceled' | 'Paused'
    outcomes: string[]
  }>
}

export type BscNavigationSport = {
  id: number
  sportId: string
  slug: string
  name: string
  activeGamesCount: number
  activeLiveGamesCount: number
  activePrematchGamesCount: number
}

type RawBscGame = Omit<BscGame, 'league' | 'status'> & {
  league: Omit<BscGame['league'], 'country'>
}

function getInitials(name: string) {
  const initials = name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return initials || '?'
}

function getAvatarColor(name: string) {
  let hash = 0
  for (let index = 0; index < name.length; index += 1) {
    hash = name.charCodeAt(index) + ((hash << 5) - hash)
  }

  const colors = ['#5E64EB', '#FF6B35', '#54D09E', '#B58EEA', '#F43F5E']
  return colors[Math.abs(hash) % colors.length]
}

function createParticipantAvatar(name: string) {
  const background = getAvatarColor(name)
  const initials = getInitials(name)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="${background}"/><text x="50%" y="53%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700" fill="#ffffff">${initials}</text></svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function normalizeGame(game: RawBscGame): BscGame {
  return {
    ...game,
    participants: game.participants.map((participant) => ({
      ...participant,
      image: createParticipantAvatar(participant.name),
    })),
    status:
      game.state === 'Canceled'
        ? 'Canceled'
        : game.state === 'Finished' || game.state === 'Stopped'
          ? 'Resolved'
          : 'Created',
    league: {
      ...game.league,
      country: game.country,
    },
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BSC_MARKET_MANAGER_API_BASE}${path}`, {
    cache: 'no-cache',
    ...init,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`BSC market-manager request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function getBscNavigation() {
  const data = await request<{ sports: BscNavigationSport[] }>(
    '/market-manager/navigation?sportHub=sports'
  )
  return data.sports
}

export async function getBscGames(sportSlug?: string, query?: string) {
  const searchParams = new URLSearchParams({
    state: 'Prematch',
    sportHub: 'sports',
    perPage: '100',
    orderBy: 'startsAt',
    orderDirection: 'asc',
  })

  if (sportSlug) searchParams.set('sportSlug', sportSlug)

  const data = await request<{
    games: RawBscGame[]
  }>(`/market-manager/games?${searchParams}`)

  const games = data.games.map(normalizeGame)

  if (!query) return games

  const regex = new RegExp(query, 'i')
  return games.filter((game) => regex.test(game.title))
}

export async function getBscGame(gameId: string) {
  const data = await request<{ games: RawBscGame[] }>(
    '/market-manager/games-by-ids',
    {
      method: 'POST',
      body: JSON.stringify({ gameIds: [gameId] }),
    }
  )

  return data.games[0] ? normalizeGame(data.games[0]) : undefined
}
