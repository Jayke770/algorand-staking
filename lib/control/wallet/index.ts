import { web3 } from '../../'
const MNEMONIC_KEY = process.env.MNEMONIC_KEY
type AccountInfo = {
    address: string,
    amount: number,
    'amount-without-pending-rewards': number,
    'apps-local-state': any[],
    'apps-total-schema': { 'num-byte-slice': number, 'num-uint': number },
    assets: any[],
    'created-apps': any[],
    'created-assets': any[],
    'min-balance': number,
    'pending-rewards': number,
    'reward-base': number,
    rewards: number,
    round: number,
    status: 'Offline' | 'Online' | string,
    'total-apps-opted-in': number,
    'total-assets-opted-in': number,
    'total-created-apps': number,
    'total-created-assets': number
}
const wallet = {
    sendAlgo: async (receiver: string, amount: number): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("Sending Algo", receiver, web3.algosdk.algosToMicroalgos(amount))
                const account = web3.algosdk.mnemonicToSecretKey(MNEMONIC_KEY as string)
                const params = await web3.algod.getTransactionParams().do()
                const txn = web3.algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                    from: account.addr,
                    to: receiver,
                    amount: web3.algosdk.algosToMicroalgos(amount),
                    note: new TextEncoder().encode("Stake refunded"),
                    suggestedParams: params
                })
                await web3.algod.sendRawTransaction(txn.signTxn(account.sk)).do().catch((e) => {
                    throw new Error(e)
                })
                console.log("Algo Send", receiver, web3.algosdk.algosToMicroalgos(amount))
                resolve(txn.txID())
            } catch (e) {
                console.log("sender error", e)
                reject(e)
            }
        })
    },
    balance: async (address: string): Promise<number> => {
        const ACCOUNT: any = await web3.algod.accountInformation(address).do()
        const INFO: AccountInfo = ACCOUNT
        return web3.algosdk.microalgosToAlgos(INFO.amount)
    },
    account: (): { sk: Uint8Array, addr: string } => {
        const account = web3.algosdk.mnemonicToSecretKey(MNEMONIC_KEY as string)
        return account
    }
}
export default wallet