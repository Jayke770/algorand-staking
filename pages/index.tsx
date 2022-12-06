import { Button, Card, Chip, Link, Navbar, Page, Tabbar } from 'konsta/react'
import Head from 'next/head'
import { MdAccountCircle, MdChevronRight } from 'react-icons/md'
import NextLink from 'next/link'
import { Web3Providers } from "../components"
import { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet'
interface Wallets {
  opened: boolean
}
export default function Home() {
  const [wallets, setWallets] = useState<Wallets>({
    opened: false
  })
  return (
    <Page>
      <Head>
        <title>$TEAM Stake</title>
      </Head>
      <Web3Providers
        opened={wallets.opened}
        onClose={() => setWallets({ ...wallets, opened: false })} />
      <Navbar
        translucent
        right={
          <Link
            onClick={() => setWallets({ ...wallets, opened: true })}
            navbar
            className='k-color-brand-teamdao-primary'>
            <MdAccountCircle
              className='text-teamdao-primary'
              size={'1.75rem'} />
          </Link>
        } />
      <div className='grid transition-all lg:grid-cols-2 xl:grid-cols-3  gap-2 py-2.5 px-2'>
        <NextLink href="/matches">
          <Card
            margin='m-0'
            className='group cursor-pointer k-color-brand-teamdao-amber'>
            <div className="flex justify-between">
              <svg width="58" height="60" viewBox="0 0 58 60" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <rect width="58" height="60" fill="url(#pattern0)" />
                <defs>
                  <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlinkHref="#image0_12_161" transform="translate(0 0.0166667) scale(0.0104167 0.0100694)" />
                  </pattern>
                  <image id="image0_12_161" width="96" height="96" xlinkHref="data:image/png;base64,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" />
                </defs>
              </svg>
              <Chip>Matches Available: 31</Chip>
            </div>
            <div className='flex justify-between gap-2 mt-4'>
              <div className='flex flex-col'>
                <div className='text-xl font-bold'>Match Staking</div>
                <div>Stake on Esports Matches</div>
              </div>
              <div className="flex justify-end items-center">
                <MdChevronRight
                  className="transition-all group-hover:-mr-1 text-zinc-300 group-hover:text-teamdao-primary"
                  size={'2.5rem'} />
              </div>
            </div>
          </Card>
        </NextLink>
      </div>
    </Page>
  )
}