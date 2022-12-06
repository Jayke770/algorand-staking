//@ts-nocheck
import { web3 } from '../../'
const MNEMONIC_KEY = process.env.MNEMONIC_KEY
const wallet = {
    sendAlgo: async (receiver: string, amount: number): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("Sending Algo", receiver, web3.algosdk.algosToMicroalgos(amount))
                const account = web3.algosdk.mnemonicToSecretKey(MNEMONIC_KEY)
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
    }
}
export default wallet