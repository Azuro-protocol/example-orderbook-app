import { ExploreContext } from '@/contexts'
import Icons from '@/icons'
import { use, useMemo } from 'react'

export const NoData = () => {
  const { sportSlug, sports, searching } = use(ExploreContext)

  const sportName = useMemo(
    () => sports?.find((sport) => sport.slug === sportSlug)?.name,
    [sportSlug, sports]
  )

  return (
    <div className="flex flex-col items-center justify-center w-full text-center">
      <Icons name="noData" />
      <div className="text-white text-[16px] font-semibold my-[20px]">
        No events
      </div>
      <div className="text-[#FFFFFF99] text-[14px] font-normal">
        Bets are currently unavailable for {sportName ?? searching}.
        <br /> Please try a different sport!
      </div>
    </div>
  )
}

export default NoData
