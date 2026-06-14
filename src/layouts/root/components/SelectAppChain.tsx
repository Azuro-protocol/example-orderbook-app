'use client'
import Select, { components } from 'react-select' // Ensure this import is at the top

import { ExploreContext } from '@/contexts'
import { useBreakpoints } from '@/hooks'
import Icons, { ChainIcon } from '@/icons'
import { useBaseBetslip, useChain } from '@azuro-org/sdk'
import { type ChainId } from '@azuro-org/toolkit'
import { use, useCallback } from 'react'
import type { DropdownIndicatorProps, OptionProps } from 'react-select'
import { bscTestnet } from 'viem/chains'

const CHAINS = [bscTestnet] as const

const chainOptions = CHAINS.map((chain) => ({
  value: chain.id,
  label: chain.name,
}))

type CustomOptionProps = OptionProps & {
  data: { value: number; label: string }
}

const CustomOption = ({ ...props }: Readonly<CustomOptionProps>) => {
  const { data } = props
  return (
    <components.Option {...props}>
      <div className="flex items-center whitespace-nowrap gap-2">
        <ChainIcon
          chainId={data.value}
          width={24}
          height={24}
          alt="chain icon"
        />
        {data.label}
      </div>
    </components.Option>
  )
}

const DropdownIndicator = (props: DropdownIndicatorProps) => (
  <components.DropdownIndicator {...props}>
    <Icons name="chevronDown" className="text-white" />
  </components.DropdownIndicator>
)

export default function SelectAppChain() {
  const { appChain, setAppChainId } = useChain()
  const { clear } = useBaseBetslip()

  const breakpoints = useBreakpoints()
  const { clearFilterGames, clearFilterSports } = use(ExploreContext)

  const handleChange = useCallback(
    (selectedOption: { value: ChainId }) => {
      setAppChainId(selectedOption.value)
      clearFilterGames()
      clearFilterSports()
      clear()
    },
    [setAppChainId, clearFilterGames, clearFilterSports, clear]
  )

  return (
    <div className="rounded-xl">
      <Select
        components={{
          IndicatorSeparator: () => null,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Option: CustomOption as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          DropdownIndicator: DropdownIndicator as any,
        }}
        styles={{
          singleValue: (base) => ({
            ...base,
            color: 'white',
            fontWeight: 400,
            fontSize: '12px',
          }),
          control: (base) => ({
            ...base,
            background: '#FFFFFF0D',
            width: 'fit-content',
            color: 'white',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: 'none',
            border: 0,
            borderRadius: '0.5rem',
          }),
          option: (base, state) => ({
            ...base,
            background: state.isSelected ? '#FFFFFF0D' : '#373B3F',
            color: 'white',
            cursor: 'pointer',
            '&:hover': {
              background: '#FFFFFF0D',
            },
          }),
          menu: (base) => ({
            ...base,
            background: '#373B3F',
            minWidth: '200px',
          }),
        }}
        value={{
          value: appChain.id,
          label: (
            <div className="flex items-center gap-2">
              <ChainIcon
                chainId={appChain.id}
                width={24}
                height={24}
                alt="icon"
              />
              {!breakpoints.isXs && !breakpoints.isSm && appChain.name}
            </div>
          ),
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={handleChange as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options={chainOptions as any}
        isSearchable={false}
      />
    </div>
  )
}
