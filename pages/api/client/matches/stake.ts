import type { NextApiResponse, NextApiRequest } from "next"
import { dbConnect, match } from '../../../../models'
import { web3, config } from '../../../../lib'
import { wallet } from '../../../../lib/control'
import moment from "moment"
type TxInfo = {
    id: string,
    txId: string,
    "confirmed-round": number,
    "pool-error": string,
    txn: {
        sig: Uint8Array,
        txn: {
            amt: number,
            fee: number,
            fv: number,
            gen: string,
            gh: Uint8Array,
            lv: number,
            note: Uint8Array,
            rcv: Uint8Array,
            snd: Uint8Array,
            type: string
        }
    }
}
interface x extends NextApiRequest {
    body: {
        txInfo: TxInfo,
        amount: number,
        teamid: string,
        matchid: string,
        address: string
    },
    method: "POST"
}
type Response = {
    status: boolean,
    title?: string,
    message?: string,
    footer?: string
} | "Internal Server Error" | "Unauthorized"
export default async function Stake(req: x, res: NextApiResponse<Response>) {
    const { method, body: { txInfo, amount, address, teamid, matchid } } = req
    try {
        if (method === 'POST' && txInfo && amount && teamid && matchid) {
            await dbConnect()
            //check match 
            const matchData = await match.findOne({
                id: { $eq: matchid },
                isDone: false,
                stakingStart: { $gte: parseInt(moment().format("x")) }
            })
            if (matchData) {
                const isAlreadyStake = matchData.bettors.find(x => x.address === address)
                if (isAlreadyStake) {
                    //refund algo
                    await wallet.sendAlgo(address, amount)
                    return res.send({
                        status: false,
                        title: "Opppss",
                        message: `You already stake this match`,
                        footer: `Your $${amount} $ALGO stake was returned.`
                    })
                } else {
                    const STAKE_DATA = {
                        betId: config.id(12),
                        address: address,
                        userid: address,
                        teamid: teamid,
                        username: "",
                        amount: amount,
                        txInfo: txInfo,
                        created: parseInt(moment().format("x")),
                    }
                    await match.updateOne({ id: { $eq: matchid } }, { $push: { bettors: STAKE_DATA } })
                    return res.send({
                        status: true,
                        title: "Transaction Completed",
                        message: `You staked ${amount} $ALGO successfully!`
                    })
                }
            } else {
                //refund algo
                await wallet.sendAlgo(address, amount)
                return res.send({
                    status: false,
                    title: "Match Not Found",
                    message: `Your ${amount} $ALGO stake was returned.`
                })
            }
        } else {
            return res.status(401).send("Unauthorized")
        }
    } catch (e) {
        return res.status(500).send("Internal Server Error")
    }
} 