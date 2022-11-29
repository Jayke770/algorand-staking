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
    }, [])
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
    const signtx = async (): Promise<void> => {
        const my_adr = 'OGTRNEO5FVJ6ZHXZAIL6GG37PPWNO3KIQNOSBX5ERHWA7B34OFCEEAYUB4'
        const receiver = 'BIPLFABQDFPUJN5BYIEA4NFTYRX4FK5S2IRWZF2FWR7HYQXGGAD45D5VE4'
        async function generatePaymentTxns({ to, initiatorAddr }: { to: string; initiatorAddr: string; }) {
            const suggestedParams = await algod.getTransactionParams().do()
            `   `;
            return [{ txn, signers: [initiatorAddr] }];
        }
        async function generateAssetTransferTxns({ to, assetID, initiatorAddr }: { to: string; assetID: number; initiatorAddr: string; }) {
            const suggestedParams = await algod.getTransactionParams().do()
            const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({ from: initiatorAddr, to, assetIndex: assetID, amount: 1, suggestedParams })
            return [{ txn, signers: [initiatorAddr] }]
        }
        const tx = await generatePaymentTxns({ to: receiver, initiatorAddr: my_adr })
        const h = await wallet.signTransaction([tx])
        const k = await algod.sendRawTransaction(h).do()
        console.log(k)
    }
    return { connect, disconnect, signtx, account, active: wallet.isConnected }
}