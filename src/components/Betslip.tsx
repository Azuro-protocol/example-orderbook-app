'use client';
import React, { useState } from 'react';
import {
  useBaseBetslip,
  useBetTokenBalance,
  useChain,
  useDetailedBetslip,
  BetslipDisableReason,
  useLiveBetFee,
  useApolloClients
} from '@azuro-org/sdk';
import { useAccount } from 'wagmi';
import compareOutcome from '@/utils/compareOutcome';
import { useBetslip } from '@/context/betslip';

import { BetButton, BetslipCard } from './index';
import { formatOdds, formatOdds2 } from '@/helpers/formatOdds';
import { MarketOutcome, PrematchBetsDocument } from '@azuro-org/toolkit';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { formatNumber } from '@/utils/number';
import { Skeleton } from '@/components';
import { useContext } from 'react';
import { ExploreContext } from '@/providers/ExploreProvider';
import { useQuery as useQueryApollo } from '@apollo/client';
import useAddEvent from '@/hooks/useAddEvent';
import { EVENT } from '@/utils/eventConstant';

const errorPerDisableReason = {
  [BetslipDisableReason.ComboWithForbiddenItem]:
    "One or more conditions can't be used in combo",
  [BetslipDisableReason.BetAmountGreaterThanMaxBet]:
    'Bet amount exceeds max bet',
  [BetslipDisableReason.BetAmountLowerThanMinBet]:
    'Bet amount lower than min bet',
  [BetslipDisableReason.ComboWithLive]: "Live outcome can't be used in combo",
  [BetslipDisableReason.ConditionStatus]:
    'One or more outcomes have been removed or suspended. Review your betslip and remove them.',
  [BetslipDisableReason.PrematchConditionInStartedGame]: 'Game has started',
  [BetslipDisableReason.ComboWithSameGame]:
    'Combo with outcomes from same game prohibited, please use Batch bet',
  [BetslipDisableReason.BatchWithLive]: "Live outcome can't be used in batch"
} as const;

export function BetslipContent({
  outcomeRowSelected,
  isFetching
}: {
  outcomeRowSelected?: MarketOutcome[];
  isFetching?: boolean;
}) {
  const account = useAccount();
  const { items, clear, removeItem } = useBaseBetslip();
  const {
    batchBetAmounts,
    odds,
    statuses,
    disableReason,
    isStatusesFetching,
    isOddsFetching,
    isLiveBet,
    changeBatchBetAmount
  } = useDetailedBetslip();

  const { betToken } = useChain();
  const [isLoading, setIsLoading] = useState(false);

  const isLoadingBet = isLoading;

  const { formattedRelayerFeeAmount, loading: isRelayerFeeLoading } =
    useLiveBetFee({
      enabled: isLiveBet
    });
  const { outcomeSelected } = useContext(ExploreContext);
  const key = `${outcomeSelected.conditionId}-${outcomeSelected.outcomeId}`;
  const betAmount = batchBetAmounts[key] || '0';
  let totalOdds = odds[key] || 0;
  let _originalOdds = totalOdds;
  totalOdds = formatOdds(totalOdds);
  const { loading: isBalanceFetching, balance } = useBetTokenBalance();

  const { openConnectModal } = useConnectModal();

  const _outcomeRowSelected = items.find((item) =>
    compareOutcome(item, outcomeSelected)
  );
  const { prematchClient } = useApolloClients();
  if (!_outcomeRowSelected) return null;
  const {
    game: { gameId },
    conditionId,
    outcomeId
  } = _outcomeRowSelected!;
  //eslint-disable-next-line
  const { data: betsData, refetch } = useQueryApollo(PrematchBetsDocument, {
    variables: {
      where: {
        _conditions_: { conditionId }
      },
      first: 1000
    },
    client: prematchClient
  });
  useAddEvent(EVENT.apolloBetslip, refetch);
  return (
    <div className="col-span-12 sm:col-span-4 p-4 mb-4 rounded-md w-full max-h-[90vh] overflow-auto ">
      {Boolean(items.length) ? (
        <>
          <BetslipCard
            key={`${gameId}-${conditionId}-${outcomeId}`}
            item={_outcomeRowSelected!}
            status={statuses[conditionId]}
            odds={odds?.[`${conditionId}-${outcomeId}`]}
            isStatusesFetching={isStatusesFetching}
            onRemove={() => removeItem(_outcomeRowSelected!)}
            outcomeRowSelected={outcomeRowSelected}
            betsData={betsData}
          />

          <div className="flex items-center mt-4 mb-2">
            <div className="flex-1">Bet Amount</div>
            {isBalanceFetching ? (
              <>
                <div>Loading...</div>
              </>
            ) : balance !== undefined ? (
              <div className="px-2 bg-appGray-50 py-1 rounded-xl">
                Wallet balance: {formatNumber(+balance, 2)} {betToken.symbol}
              </div>
            ) : null}
          </div>
          <div className="flex mt-2 px-2 py-2 items-center justify-between border-appGray-100 border rounded-lg h-[56px]">
            <input
              type="number"
              className="text-[#B58EEA] bg-transparent border-none outline-none focus:ring-0 resize-none w-full text-right px-2 input-no-arrow"
              value={batchBetAmounts[`${conditionId}-${outcomeId}`]}
              onChange={(event) => {
                if (event.target.value.length > 16) return;
                changeBatchBetAmount(
                  _outcomeRowSelected!,
                  Number(event.target.value) < 0 ? '0' : event.target.value
                );
              }}
              max={16}
              placeholder="Enter Bet amount"
              disabled={isLoadingBet}
            />
            <p>{betToken.symbol}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-md text-white text-opacity-80">Price:</span>
            <span className="text-md font-semibold">
              {isOddsFetching || isFetching ? (
                <Skeleton className="!w-[50px] !h-[21px]" />
              ) : (
                <>{+betAmount <= 0 ? 0 : totalOdds.toFixed(2)}¢</>
              )}
            </span>
          </div>
          {/* <div className="flex items-center justify-between mt-4">
            <span className="text-md text-white text-opacity-80">Odds</span>
            <span className="text-md font-semibold">
              {isOddsFetching ? (
                <Skeleton className="!w-[50px] !h-[21px]" />
              ) : (
                <>{+betAmount < 0 ? 0 : Number(_originalOdds).toFixed(2)} </>
              )}
            </span>
          </div> */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-md text-white text-opacity-80">
              Possible win:
            </span>
            <span className="text-md font-semibold text-[#54D09E]">
              {isOddsFetching || isFetching ? (
                <Skeleton className="!w-[50px] !h-[21px]" />
              ) : (
                <>
                  {Number(betAmount) < 0 ? (
                    <>0 {betToken.symbol}</>
                  ) : (
                    <>
                      {(+betAmount * _originalOdds || 0).toFixed(2)}{' '}
                      {betToken.symbol}
                    </>
                  )}
                </>
              )}
            </span>
          </div>

          {Boolean(isRelayerFeeLoading || formattedRelayerFeeAmount) && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-md ">Relayer fee:</span>
              <span className="text-md font-semibold">
                {isRelayerFeeLoading ? (
                  <>Loading...</>
                ) : (
                  <>{formattedRelayerFeeAmount}</>
                )}
              </span>
            </div>
          )}
          {Boolean(disableReason) && (
            <div className="mb-1 text-red-500 text-center font-semibold">
              {/* @ts-ignore */}
              {errorPerDisableReason[disableReason!]}
            </div>
          )}
          {account?.address ? (
            <BetButton setIsLoading={setIsLoading} />
          ) : (
            <button
              onClick={openConnectModal}
              className="mt-6 py-3.5 text-center rounded-xl bg-primary w-full font-bold"
            >
              Connect Wallet
            </button>
          )}
        </>
      ) : (
        <div>Empty</div>
      )}
    </div>
  );
}

export function Betslip() {
  const { isOpen, setOpen } = useBetslip();
  const { items } = useBaseBetslip();

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-full md:max-w-sm">
      {isOpen && <BetslipContent />}
      <button
        className="flex items-center py-2 px-4 bg-black whitespace-nowrap rounded-full ml-auto"
        onClick={() => setOpen(!isOpen)}
      >
        Betslip {items.length || ''}
      </button>
    </div>
  );
}
