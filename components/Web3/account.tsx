import { useConnectWallet, useWallet } from '@txnlab/use-wallet'
import { Button, Card, Icon, Link, Popover } from 'konsta/react'
import { useEffect, useRef, useState } from 'react'
import { MdAccountCircle } from "react-icons/md"
import { Web3Providers } from '../'
import { Account, useAccount } from '../../lib/client'
import Image from 'next/image'
import { config } from '../../lib'
type props = {
    onClick?: () => void
}
type AccountData = {
    address: string,
    wallet: string,
    avatar: string,
    created: number
}
interface Account {
    opened: boolean,
    openedProviders: boolean,
    account?: AccountData
}
export default function Web3Account({ onClick }: props) {
    const popupRef = useRef<HTMLDivElement>(null)
    const { accountData, _getAccountData } = useAccount()
    const { disconnect, activeAccount } = useConnectWallet()
    const [account, setAccount] = useState<Account>({
        opened: false,
        openedProviders: false,
        account: undefined
    })
    useEffect(() => {
        if (activeAccount) _getAccountData(activeAccount?.address, activeAccount?.providerId)
    }, [activeAccount])
    return (
        <>
            <div className='flex' ref={popupRef}>
                <Link
                    onClick={() => setAccount({ ...account, opened: true })}
                    navbar
                    className='k-color-brand-teamdao-primary'>
                    <MdAccountCircle
                        className='text-teamdao-primary'
                        size={'1.75rem'} />
                </Link>
            </div>
            <Popover
                colors={{
                    bgMaterial: 'bg-md-light-surface-1 dark:bg-md-dark-surface-1'
                }}
                target={popupRef.current}
                opened={account.opened}
                onBackdropClick={() => setAccount({ ...account, opened: false })}>
                <Card
                    margin='m-0'>
                    <div className='flex flex-col gap-5'>
                        {activeAccount ? (
                            <>
                                <div className='flex justify-center items-center'>
                                    <img
                                        loading='lazy'
                                        src={accountData?.avatar}
                                        alt={accountData?.address}
                                        className="w-20 h-20 rounded-full object-contain" />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex justify-between text-sm font-semibold items-baseline'>
                                        <span className='text-zinc-400'>Address</span>
                                        <span className='text-zinc-300'>{config.substr(accountData?.address)}</span>
                                    </div>
                                    <div className='flex justify-between text-sm font-semibold items-baseline'>
                                        <span className='text-zinc-400'>Balance</span>
                                        <span className='text-zinc-300'>44 $ALGO</span>
                                    </div>
                                </div>
                                <div className='flex'>
                                    <Button
                                        onClick={async () => await disconnect(activeAccount?.providerId)}
                                        small
                                        className=' k-color-brand-teamdao-red'>
                                        Disconnect Wallet
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='flex justify-center items-center'>
                                    <img
                                        loading='lazy'
                                        src={'/assets/logo.png'}
                                        alt={'logo'}
                                        className="w-20 h-20 rounded-full object-contain" />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex justify-between text-sm font-semibold items-baseline'>
                                        <span className='text-zinc-400'>Address</span>
                                        <span className='text-zinc-300'>******</span>
                                    </div>
                                    <div className='flex justify-between text-sm font-semibold items-baseline'>
                                        <span className='text-zinc-400'>Balance</span>
                                        <span className='text-zinc-300'>*** </span>
                                    </div>
                                </div>
                                <div className='flex'>
                                    <Button
                                        onClick={() => setAccount({ ...account, openedProviders: true })}
                                        small
                                        className=' k-color-brand-teamdao-primary'>
                                        Connect Wallet
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </Card>
            </Popover>
            <Web3Providers
                opened={account?.openedProviders}
                onClose={() => setAccount({ ...account, openedProviders: false })} />
        </>
    )
}