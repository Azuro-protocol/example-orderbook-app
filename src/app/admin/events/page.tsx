'use client'

import {
  BSC_MARKET_MANAGER_ADMIN_API_BASE,
  BSC_TESTNET_BET_TOKEN,
  BSC_TESTNET_CHAIN_ID,
  BSC_TESTNET_CONTRACTS,
} from '@/config/bsc'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { waitForTransactionReceipt } from '@wagmi/core'
import { useEffect, useMemo, useState } from 'react'
import { parseAbi, parseUnits } from 'viem'
import {
  useAccount,
  useConfig,
  useSwitchChain,
  useWriteContract,
} from 'wagmi'

type PendingEvent = {
  id: number
  source: string
  sourceEventId: string
  gameId: string
  title: string
  startsAt: string
  status: 'Pending' | 'Approved' | 'Rejected'
  sport: {
    name: string
    sportId: string
  }
  country: {
    name: string
  }
  league: {
    name: string
  }
  participants: Array<{
    name: string
    image: string | null
  }>
}

const lpAbi = parseAbi([
  'function createGame(uint256 gameId,uint64 startsAt,bytes data)',
])

const prematchCoreAbi = parseAbi([
  'function createCondition(uint256 gameId,uint256 conditionId,uint256[] odds,uint64[] outcomes,uint128 reinforcement,uint64 margin,uint8 winningOutcomesCount,bool isExpressForbidden)',
])

function getDefaultDate() {
  return new Date().toISOString().slice(0, 10)
}

function getAdminToken() {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem('azuro-admin-token') || ''
}

const theOddsApiSports = [
  { label: 'Basketball NBA', value: 'basketball_nba' },
  { label: 'Basketball WNBA', value: 'basketball_wnba' },
  { label: 'Soccer EPL', value: 'soccer_epl' },
  { label: 'Soccer MLS', value: 'soccer_usa_mls' },
  { label: 'Tennis ATP Wimbledon', value: 'tennis_atp_wimbledon' },
  { label: 'Tennis WTA Wimbledon', value: 'tennis_wta_wimbledon' },
  { label: 'Baseball MLB', value: 'baseball_mlb' },
  { label: 'American Football NFL', value: 'americanfootball_nfl' },
]

const sportradarSports = [
  { label: 'Soccer', value: 'sr:sport:1' },
  { label: 'Basketball', value: 'sr:sport:2' },
  { label: 'Tennis', value: 'sr:sport:5' },
]

export default function AdminEventsPage() {
  const [adminToken, setAdminToken] = useState('')
  const [events, setEvents] = useState<PendingEvent[]>([])
  const [source, setSource] = useState<'the-odds-api' | 'sportradar'>('the-odds-api')
  const [date, setDate] = useState(getDefaultDate)
  const [sportId, setSportId] = useState('sr:sport:2')
  const [sportKey, setSportKey] = useState('basketball_nba')
  const [message, setMessage] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [isImporting, setImporting] = useState(false)
  const account = useAccount()
  const config = useConfig()
  const { openConnectModal } = useConnectModal()
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()

  const headers = useMemo(
    () => ({
      authorization: `Bearer ${adminToken}`,
      'content-type': 'application/json',
    }),
    [adminToken]
  )

  useEffect(() => {
    setAdminToken(getAdminToken())
  }, [])

  const saveAdminToken = (value: string) => {
    setAdminToken(value)
    window.localStorage.setItem('azuro-admin-token', value)
  }

  const loadEvents = async () => {
    if (!adminToken) return
    setMessage(null)
    const response = await fetch(
      `${BSC_MARKET_MANAGER_ADMIN_API_BASE}/pending-events?status=Pending`,
      { headers }
    )
    if (!response.ok) {
      setMessage(`Load failed: ${response.status}`)
      return
    }
    const data = (await response.json()) as { events: PendingEvent[] }
    setEvents(data.events)
  }

  useEffect(() => {
    if (adminToken) {
      void loadEvents()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken])

  const importEvents = async () => {
    setImporting(true)
    setMessage(null)
    try {
      const endpoint =
        source === 'the-odds-api'
          ? `${BSC_MARKET_MANAGER_ADMIN_API_BASE}/the-odds-api/import`
          : `${BSC_MARKET_MANAGER_ADMIN_API_BASE}/sportradar/import`
      const body =
        source === 'the-odds-api'
          ? {
              date,
              limit: 50,
              markets: 'h2h',
              regions: 'us',
              sportKey,
            }
          : {
              accessLevel: 'trial',
              date,
              language: 'en',
              limit: 50,
              sportId,
            }
      const response = await fetch(
        endpoint,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        setMessage(`Import failed: ${JSON.stringify(data)}`)
        return
      }
      setMessage(`Imported ${data.imported || 0} ${source} events.`)
      await loadEvents()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  const approveEvent = async (event: PendingEvent) => {
    setMessage(null)

    if (!account.address) {
      openConnectModal?.()
      return
    }

    if (account.chainId !== BSC_TESTNET_CHAIN_ID) {
      await switchChainAsync({ chainId: BSC_TESTNET_CHAIN_ID })
    }

    setBusyId(event.id)
    try {
      const gameId = BigInt(event.gameId)
      const startsAt = BigInt(event.startsAt)

      setMessage(`Creating game ${event.gameId}...`)
      const gameTxHash = await writeContractAsync({
        address: BSC_TESTNET_CONTRACTS.lp,
        abi: lpAbi,
        functionName: 'createGame',
        chainId: BSC_TESTNET_CHAIN_ID,
        args: [gameId, startsAt, '0x'],
      })
      await waitForTransactionReceipt(config, {
        chainId: BSC_TESTNET_CHAIN_ID,
        hash: gameTxHash,
      })

      setMessage(`Creating condition ${event.gameId}...`)
      const conditionTxHash = await writeContractAsync({
        address: BSC_TESTNET_CONTRACTS.prematchCore,
        abi: prematchCoreAbi,
        functionName: 'createCondition',
        chainId: BSC_TESTNET_CHAIN_ID,
        args: [
          gameId,
          gameId,
          [BigInt('2000000000000'), BigInt('2000000000000')],
          [BigInt(1), BigInt(2)],
          parseUnits('1000', BSC_TESTNET_BET_TOKEN.decimals),
          BigInt('50000000000'),
          1,
          false,
        ],
      })
      await waitForTransactionReceipt(config, {
        chainId: BSC_TESTNET_CHAIN_ID,
        hash: conditionTxHash,
      })

      const response = await fetch(
        `${BSC_MARKET_MANAGER_ADMIN_API_BASE}/pending-events/${event.id}/approve`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            conditionId: event.gameId,
            conditionTxHash,
            coreAddress: BSC_TESTNET_CONTRACTS.prematchCore,
            gameTxHash,
            lpAddress: BSC_TESTNET_CONTRACTS.lp,
            oracleAddress: account.address,
            outcomes: ['1', '2'],
          }),
        }
      )
      const data = await response.json()
      if (!response.ok) {
        setMessage(`Approve writeback failed: ${JSON.stringify(data)}`)
        return
      }

      setMessage(`Approved ${event.title}`)
      await loadEvents()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Approve failed')
    } finally {
      setBusyId(null)
    }
  }

  const rejectEvent = async (event: PendingEvent) => {
    setBusyId(event.id)
    setMessage(null)
    try {
      const response = await fetch(
        `${BSC_MARKET_MANAGER_ADMIN_API_BASE}/pending-events/${event.id}/reject`,
        {
          method: 'POST',
          headers,
        }
      )
      if (!response.ok) {
        setMessage(`Reject failed: ${response.status}`)
        return
      }
      await loadEvents()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-6xl pb-16">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Events</h1>
          <p className="mt-2 text-appGray-600">
            Import data-source events, then approve them with the owner/oracle
            wallet.
          </p>
        </div>
        <button
          className="rounded-lg bg-[#FFFFFF1A] px-4 py-2 font-semibold"
          onClick={loadEvents}
        >
          Refresh
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 rounded-lg bg-[#FFFFFF0D] p-4 md:grid-cols-[1.2fr_160px_180px_220px_auto]">
        <label className="flex flex-col gap-2 text-[12px] text-appGray-600">
          Admin token
          <input
            className="h-10 rounded-lg bg-[#FFFFFF1A] px-3 text-white outline-none"
            onChange={(event) => saveAdminToken(event.target.value)}
            placeholder="Bearer token"
            type="password"
            value={adminToken}
          />
        </label>
        <label className="flex flex-col gap-2 text-[12px] text-appGray-600">
          Date
          <input
            className="h-10 rounded-lg bg-[#FFFFFF1A] px-3 text-white outline-none"
            onChange={(event) => setDate(event.target.value)}
            type="date"
            value={date}
          />
        </label>
        <label className="flex flex-col gap-2 text-[12px] text-appGray-600">
          Source
          <select
            className="h-10 rounded-lg bg-[#FFFFFF1A] px-3 text-white outline-none"
            onChange={(event) => setSource(event.target.value as 'the-odds-api' | 'sportradar')}
            value={source}
          >
            <option value="the-odds-api">The Odds API</option>
            <option value="sportradar">Sportradar</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-[12px] text-appGray-600">
          Sport
          <select
            className="h-10 rounded-lg bg-[#FFFFFF1A] px-3 text-white outline-none"
            onChange={(event) => {
              if (source === 'the-odds-api') {
                setSportKey(event.target.value)
              }
              else {
                setSportId(event.target.value)
              }
            }}
            value={source === 'the-odds-api' ? sportKey : sportId}
          >
            {(source === 'the-odds-api' ? theOddsApiSports : sportradarSports).map((sport) => (
              <option key={sport.value} value={sport.value}>
                {sport.label}
              </option>
            ))}
          </select>
        </label>
        <button
          className="h-10 self-end rounded-lg bg-primary px-4 font-bold disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!adminToken || isImporting}
          onClick={importEvents}
        >
          {isImporting ? 'Importing...' : 'Import'}
        </button>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-[#FFFFFF0D] px-4 py-3 text-[13px] text-appGray-600 break-words">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {events.map((event) => (
          <div
            className="grid grid-cols-1 gap-4 rounded-lg bg-[#FFFFFF0D] p-4 md:grid-cols-[1fr_auto]"
            key={event.id}
          >
            <div>
              <div className="text-[12px] text-appGray-600">
                {event.source} · {event.sport.name} · {event.country.name} ·{' '}
                {event.league.name}
              </div>
              <div className="mt-1 text-lg font-semibold">{event.title}</div>
              <div className="mt-2 text-[13px] text-appGray-600">
                Game ID {event.gameId} ·{' '}
                {new Date(Number(event.startsAt) * 1000).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-2 md:justify-end">
              <button
                className="rounded-lg bg-[#FFFFFF1A] px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                disabled={busyId === event.id}
                onClick={() => rejectEvent(event)}
              >
                Reject
              </button>
              <button
                className="rounded-lg bg-primary px-4 py-2 font-bold disabled:cursor-not-allowed disabled:opacity-50"
                disabled={busyId === event.id}
                onClick={() => approveEvent(event)}
              >
                {busyId === event.id ? 'Working...' : 'Approve'}
              </button>
            </div>
          </div>
        ))}
        {!events.length && (
          <div className="rounded-lg bg-[#FFFFFF0D] p-8 text-center text-appGray-600">
            No pending events.
          </div>
        )}
      </div>
    </div>
  )
}
