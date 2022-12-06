import { Card, Button } from 'konsta/react'
import { TiWarning } from 'react-icons/ti'
import { Web3Providers } from '../'
import { useState } from 'react'
interface Opts {
    openWallets: boolean
}
export default function NotifyConnectWallet() {
    const [walletOpts, setWalletOpts] = useState<Opts>({
        openWallets: false
    })
    return (
        <>
            <div className='flex z-30 w-full justify-end items-end fixed bottom-0 p-4 h-full bg-black/70 cursor-pointer'>
                <Card
                    className='animate__animated animate__fadeInUp ms-300 w-full md:w-96'
                    margin='m-0'>
                    <div className='flex flex-col gap-3'>
                        <div className='flex gap-2 items-center'>
                            <TiWarning
                                className='text-4xl text-amber-600' />
                            <span className='font-semibold text-base'>Connect your wallet to stake.</span>
                        </div>
                        <Button
                            small
                            rounded
                            onClick={() => setWalletOpts({ ...walletOpts, openWallets: true })}
                            className=' k-color-brand-teamdao-primary font-bold'>Connect Wallet</Button>
                    </div>
                </Card>
            </div>
            <Web3Providers
                opened={walletOpts.openWallets}
                onClose={() => setWalletOpts({ ...walletOpts, openWallets: false })} />
        </>
    )
}