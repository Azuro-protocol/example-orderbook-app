'use client'

import {
  BSC_TESTNET_BET_TOKEN,
  BSC_TESTNET_CHAIN_ID,
  BSC_TESTNET_CONTRACTS,
} from '@/config/bsc'
import type { BscGame } from '@/services/bscMarketManager'
import { formatOdds } from '@/utils'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { waitForTransactionReceipt } from '@wagmi/core'
import { useMemo, useState } from 'react'
import {
  encodeAbiParameters,
  formatUnits,
  maxUint256,
  parseAbi,
  parseUnits,
  zeroAddress,
  type Address,
} from 'viem'
import {
  useAccount,
  useConfig,
  useReadContract,
  useSwitchChain,
  useWriteContract,
} from 'wagmi'

type BscImportedMarketsProps = {
  readonly game: BscGame
}

const erc20Abi = parseAbi([
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function availableToClaim(address account) view returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function claim(address account)',
])

const prematchCoreAbi = parseAbi([
  'function calcOdds(uint256 conditionId, uint128 amount, uint64 outcome) view returns (uint64 odds)',
])

const lpAbi = parseAbi([
  'function bet(address core, uint128 amount, uint64 expiresAt, (address affiliate, uint64 minOdds, bytes data) betData) returns (uint256)',
])

function getRawAmount(amount: string) {
  if (!amount || Number(amount) <= 0) return BigInt(0)
  return parseUnits(amount, BSC_TESTNET_BET_TOKEN.decimals)
}

type BscBetOutcomeButtonProps = {
  readonly amount: string
  readonly condition: BscGame['conditions'][0]
  readonly index: number
  readonly isBusy: boolean
  readonly onBet: (outcomeId: string, rawOdds: bigint) => Promise<void>
  readonly outcomeId: string
  readonly participantName: string
}

function BscBetOutcomeButton({
  amount,
  condition,
  index,
  isBusy,
  onBet,
  outcomeId,
  participantName,
}: BscBetOutcomeButtonProps) {
  const rawAmount = useMemo(() => {
    const parsed = getRawAmount(amount)
    return parsed > BigInt(0)
      ? parsed
      : parseUnits('1', BSC_TESTNET_BET_TOKEN.decimals)
  }, [amount])

  const { data: rawOdds, isFetching } = useReadContract({
    address: BSC_TESTNET_CONTRACTS.prematchCore,
    abi: prematchCoreAbi,
    functionName: 'calcOdds',
    chainId: BSC_TESTNET_CHAIN_ID,
    args: [BigInt(condition.conditionId), rawAmount, BigInt(outcomeId)],
    query: {
      enabled: condition.status === 'Created',
      refetchInterval: 15_000,
    },
  })

  const odds = rawOdds ? Number(formatUnits(rawOdds, 12)) : 0
  const price = odds ? `${formatOdds(odds).toFixed(2)}¢` : '--'

  return (
    <button
      className="flex flex-col p-4 transition rounded-3xl w-full disabled:cursor-not-allowed disabled:opacity-50 bg-appGray-100"
      disabled={!rawOdds || isFetching || isBusy || condition.status !== 'Created'}
      onClick={() => rawOdds && onBet(outcomeId, rawOdds)}
    >
      <div className="flex justify-between w-full">
        <div className="font-semibold text-base">{participantName}</div>
        <p
          className={
            index === 0
              ? 'font-medium rounded-full font-bold text-xl text-button-LightGreen'
              : 'font-medium rounded-full font-bold text-xl text-button-red'
          }
        >
          {isFetching ? '...' : price}
        </p>
      </div>
    </button>
  )
}

function BscBettingMarkets({ game }: BscImportedMarketsProps) {
  const condition = game.conditions[0]
  const [amount, setAmount] = useState('1')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const account = useAccount()
  const config = useConfig()
  const { openConnectModal } = useConnectModal()
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()

  const rawAmount = useMemo(() => getRawAmount(amount), [amount])

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: BSC_TESTNET_BET_TOKEN.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    chainId: BSC_TESTNET_CHAIN_ID,
    args: [account.address as Address],
    query: {
      enabled: Boolean(account.address),
    },
  })

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: BSC_TESTNET_BET_TOKEN.address,
    abi: erc20Abi,
    functionName: 'allowance',
    chainId: BSC_TESTNET_CHAIN_ID,
    args: [account.address as Address, BSC_TESTNET_CONTRACTS.lp],
    query: {
      enabled: Boolean(account.address),
    },
  })

  const { data: canClaim, refetch: refetchCanClaim } = useReadContract({
    address: BSC_TESTNET_BET_TOKEN.address,
    abi: erc20Abi,
    functionName: 'availableToClaim',
    chainId: BSC_TESTNET_CHAIN_ID,
    args: [account.address as Address],
    query: {
      enabled: Boolean(account.address),
    },
  })

  const hasEnoughBalance = typeof balance !== 'bigint' || balance >= rawAmount

  const handleClaim = async () => {
    setMessage(null)

    if (!account.address) {
      openConnectModal?.()
      return
    }

    if (account.chainId !== BSC_TESTNET_CHAIN_ID) {
      await switchChainAsync({ chainId: BSC_TESTNET_CHAIN_ID })
    }

    setBusy(true)
    try {
      setMessage(`Claiming ${BSC_TESTNET_BET_TOKEN.symbol}...`)
      const claimHash = await writeContractAsync({
        address: BSC_TESTNET_BET_TOKEN.address,
        abi: erc20Abi,
        functionName: 'claim',
        chainId: BSC_TESTNET_CHAIN_ID,
        args: [account.address],
      })
      await waitForTransactionReceipt(config, {
        chainId: BSC_TESTNET_CHAIN_ID,
        hash: claimHash,
      })
      await refetchBalance()
      await refetchCanClaim()
      setMessage(`Claimed test ${BSC_TESTNET_BET_TOKEN.symbol}: ${claimHash}`)
    } catch (error) {
      const description =
        error instanceof Error ? error.message : 'Claim transaction failed.'
      setMessage(description)
    } finally {
      setBusy(false)
    }
  }

  const handleBet = async (outcomeId: string, rawOdds: bigint) => {
    setMessage(null)

    if (!account.address) {
      openConnectModal?.()
      return
    }

    if (account.chainId !== BSC_TESTNET_CHAIN_ID) {
      await switchChainAsync({ chainId: BSC_TESTNET_CHAIN_ID })
    }

    if (rawAmount <= BigInt(0)) {
      setMessage('Enter a bet amount greater than 0.')
      return
    }

    if (typeof balance === 'bigint' && balance < rawAmount) {
      setMessage(`Not enough ${BSC_TESTNET_BET_TOKEN.symbol} balance.`)
      return
    }

    setBusy(true)
    try {
      if (typeof allowance !== 'bigint' || allowance < rawAmount) {
        setMessage(`Approving ${BSC_TESTNET_BET_TOKEN.symbol}...`)
        const approveHash = await writeContractAsync({
          address: BSC_TESTNET_BET_TOKEN.address,
          abi: erc20Abi,
          functionName: 'approve',
          chainId: BSC_TESTNET_CHAIN_ID,
          args: [BSC_TESTNET_CONTRACTS.lp, maxUint256],
        })
        await waitForTransactionReceipt(config, {
          chainId: BSC_TESTNET_CHAIN_ID,
          hash: approveHash,
        })
        await refetchAllowance()
      }

      const betData = encodeAbiParameters(
        [
          {
            type: 'tuple',
            components: [
              { name: 'conditionId', type: 'uint256' },
              { name: 'outcomeId', type: 'uint64' },
            ],
          },
        ],
        [
          {
            conditionId: BigInt(condition.conditionId),
            outcomeId: BigInt(outcomeId),
          },
        ]
      )

      const minOdds = (rawOdds * BigInt(90)) / BigInt(100)
      const expiresAt = BigInt(Math.floor(Date.now() / 1000) + 300)
      const affiliate =
        (process.env.NEXT_PUBLIC_AFFILIATE_ADDRESS as Address | undefined) ||
        zeroAddress

      setMessage('Placing bet...')
      const betHash = await writeContractAsync({
        address: BSC_TESTNET_CONTRACTS.lp,
        abi: lpAbi,
        functionName: 'bet',
        chainId: BSC_TESTNET_CHAIN_ID,
        args: [
          BSC_TESTNET_CONTRACTS.prematchCore,
          rawAmount,
          expiresAt,
          {
            affiliate,
            minOdds,
            data: betData,
          },
        ],
      })
      await waitForTransactionReceipt(config, {
        chainId: BSC_TESTNET_CHAIN_ID,
        hash: betHash,
      })
      await refetchBalance()
      setMessage(`Bet placed: ${betHash}`)
    } catch (error) {
      const description =
        error instanceof Error ? error.message : 'Bet transaction failed.'
      setMessage(description)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-[800px] mx-auto mt-12 space-y-6">
      <div className="bg-[#FFFFFF0D] p-4 rounded-xl">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="font-semibold text-base">
            BSC Testnet ERC20 Market
            <span className="text-[12px] text-appGray-600 font-normal ml-2">
              Condition {condition.conditionId}
            </span>
          </div>
          {typeof balance === 'bigint' && (
            <div className="px-2 bg-appGray-50 py-1 rounded-xl text-[12px]">
              Balance:{' '}
              {Number(
                formatUnits(balance, BSC_TESTNET_BET_TOKEN.decimals)
              ).toFixed(2)}{' '}
              {BSC_TESTNET_BET_TOKEN.symbol}
            </div>
          )}
        </div>
        <div className="flex mt-2 mb-4 px-2 py-2 items-center justify-between border-appGray-100 border rounded-lg h-[56px]">
          <input
            type="number"
            className="text-[#B58EEA] bg-transparent border-none outline-none focus:ring-0 resize-none w-full text-right px-2 input-no-arrow"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Enter bet amount"
            disabled={busy}
          />
          <p>{BSC_TESTNET_BET_TOKEN.symbol}</p>
        </div>
        {!hasEnoughBalance && (
          <div className="mb-3 rounded-lg bg-[#FFFFFF0D] px-4 py-3 text-center">
            <div className="mb-3 text-red-500 font-semibold">
              Not enough {BSC_TESTNET_BET_TOKEN.symbol} balance.
            </div>
            {canClaim && (
              <button
                className="rounded-xl bg-primary px-4 py-2 font-bold disabled:cursor-not-allowed disabled:opacity-50"
                disabled={busy}
                onClick={handleClaim}
              >
                Claim 100 test {BSC_TESTNET_BET_TOKEN.symbol}
              </button>
            )}
          </div>
        )}
        <div className="flex gap-6 flex-col sm:flex-row">
          {condition.outcomes.slice(0, 2).map((outcomeId, index) => (
            <BscBetOutcomeButton
              key={`${condition.conditionId}-${outcomeId}`}
              amount={amount}
              condition={condition}
              index={index}
              isBusy={busy}
              onBet={handleBet}
              outcomeId={outcomeId}
              participantName={
                game.participants[index]?.name || `Outcome ${index + 1}`
              }
            />
          ))}
        </div>
        {message && (
          <div className="mt-4 rounded-lg bg-[#FFFFFF0D] px-4 py-3 text-[13px] text-appGray-600 break-words">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default function BscImportedMarkets({ game }: BscImportedMarketsProps) {
  const [home, away] = game.participants
  const condition = game.conditions[0]

  if (condition) {
    return <BscBettingMarkets game={game} />
  }

  return (
    <div className="max-w-[800px] mx-auto mt-12 space-y-6">
      <div className="bg-[#FFFFFF0D] p-4 rounded-xl">
        <div className="font-semibold text-base mb-4">
          Imported BSC Testnet Event
          <span className="text-[12px] text-appGray-600 font-normal ml-2">
            Conditions pending
          </span>
        </div>
        <div className="flex gap-6 flex-col sm:flex-row">
          {[home, away].map((participant, index) => (
            <button
              key={`${game.gameId}-${participant?.name || index}`}
              className="flex flex-col p-4 transition rounded-3xl w-full disabled:cursor-not-allowed disabled:opacity-70 bg-appGray-100"
              disabled
            >
              <div className="flex justify-between w-full">
                <div className="font-semibold text-base">
                  {participant?.name || `Outcome ${index + 1}`}
                </div>
                <p
                  className={
                    index === 0
                      ? 'font-medium rounded-full font-bold text-xl text-button-LightGreen'
                      : 'font-medium rounded-full font-bold text-xl text-button-red'
                  }
                >
                  --
                </p>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-lg bg-[#FFFFFF0D] px-4 py-3 text-[13px] text-appGray-600">
          This event has been imported into the BSC Testnet feed. Betting stays
          disabled until matching on-chain conditions and outcomes are created
          for this game.
        </div>
      </div>
    </div>
  )
}
