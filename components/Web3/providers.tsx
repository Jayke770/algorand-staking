import { Actions, Button, Card } from 'konsta/react'
import { useConnectWallet, PROVIDER_ID } from '@txnlab/use-wallet'
import { useState } from 'react'
type props = {
    opened: boolean,
    onClose: () => void
}
export default function Connectors({ opened, onClose }: props) {
    const { providers } = useConnectWallet({
        providers: [
            PROVIDER_ID.DEFLY,
            PROVIDER_ID.PERA_WALLET,
            PROVIDER_ID.MYALGO_WALLET,
            PROVIDER_ID.WALLET_CONNECT,
        ]
    })
    return (
        <Actions
            onBackdropClick={onClose}
            opened={opened}>
            <Card>
                <div className='px-3 text-xl font-bold mb-3'>Select Your Wallet</div>
                <div className='grid md:grid-cols-2 gap-2 transition-all'>
                    {providers.map((x) => (
                        <Button
                            key={x.name}
                            onClick={async (): Promise<void> => {
                                await x.connect()
                            }}
                            clear
                            large
                            className='overflow-auto'>
                            <div className='flex justify-start items-center gap-2 w-full'>
                                <img
                                    alt={x.name}
                                    src={x.icon}
                                    className=" rounded-lg h-10 w-10 object-contain" />
                                <span>{x.name}</span>
                            </div>
                        </Button>
                    ))}
                </div>
            </Card>
        </Actions>
    )
}