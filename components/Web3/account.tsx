import { useConnectWallet, useWallet } from '@txnlab/use-wallet'
import { Button, Card, Link, Popover } from 'konsta/react'
import { useEffect, useRef, useState } from 'react'
import { MdAccountCircle } from "react-icons/md"
import { Web3Providers } from '../'
type props = {
    onClick?: () => void
}
interface Account {
    opened?: boolean,
    openedProviders?: boolean
}
export default function Web3Account({ onClick }: props) {
    const popupRef = useRef<HTMLDivElement>(null)
    const { disconnect } = useConnectWallet()
    const { activeAccount } = useWallet()
    const [account, setAccount] = useState<Account>()
    useEffect(() => {
        if (activeAccount) {
            console.log('fsafsfsff', activeAccount)
        }
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
                opened={account?.opened}
                onBackdropClick={() => setAccount({ ...account, opened: false })}>
                <Card
                    margin='m-0'>
                    <div className='flex justify-center items-center'>

                    </div>
                    {activeAccount ? (
                        <Button
                            onClick={async () => await disconnect(activeAccount.providerId)}>Disconnect Wallet</Button>
                    ) : (
                        <Button
                            onClick={() => setAccount({ ...account, openedProviders: true })}>Connect Wallet</Button>
                    )}
                </Card>
            </Popover>
            <Web3Providers
                opened={account?.openedProviders}
                onClose={() => setAccount({ ...account, openedProviders: false })} />
        </>
    )
}