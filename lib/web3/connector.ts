import { PeraWalletConnect } from "@perawallet/connect"
import { useState, useEffect } from 'react'
import algosdk from 'algosdk'
const wallet = new PeraWalletConnect({
    network: 'testnet',
    chainId: 416002,
    shouldShowSignTxnToast: true
})
const server = 'https://node.testnet.algoexplorerapi.io'
const port = '';
const token = ''
const algod = new algosdk.Algodv2(token, server, port)
interface Account {
    address?: string,
    chainid?: number
}
export default function useWeb3() {
    const [account, setAccount] = useState<Account>()
    useEffect(() => {
        wallet.reconnectSession().then((accounts) => {
            wallet.connector?.on("disconnect", disconnect);
            if (accounts.length) {
                setAccount({ ...account, address: accounts[0] })
            }
        }).catch((e) => console.log(e))
    }, [account,])
    const connect = (): void => {
        wallet.connect().then((accounts) => {
            wallet.connector?.on("disconnect", disconnect)
            setAccount({ ...account, address: accounts[0] })
        }).catch((error) => {
            if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
                console.log(error)
            }
        })
    }
    const disconnect = () => {
        wallet.disconnect()
        setAccount({ address: undefined, chainid: undefined })
    }
    return { connect, disconnect, account, active: wallet.isConnected }
}