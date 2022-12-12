import moment from "moment"
import type { NextApiResponse, NextApiRequest } from "next"
import { getSession } from 'next-auth/react'
import { web3, config } from "../../../../lib"
import { wallet } from "../../../../lib/control"
import { dbConnect, match, account } from "../../../../models"
interface x extends NextApiRequest {
    body: {
        matchid: string,
        type: 'beta-exec' | 'beta-admin' | 'draw',
        teamid: string
    },
    method: 'POST'
}
export default async function Declare(req: x, res: NextApiResponse<ApiResponse>) {
    const { method, body: { matchid, type, teamid } } = req
    const USER = await getSession({ req })
    const SYSTEM_ACCOUNT = wallet.account()
    let profit: number = 0, winnersTx: Uint8Array[] = []
    try {
        if (USER && method === 'POST' && matchid && type) {
            await dbConnect()
            //check match
            const MatchFound = await match.findOne({ id: { $eq: matchid } })
            if (MatchFound) {
                //if match already ended 
                if (MatchFound.isDone) {
                    return res.send({
                        status: false,
                        message: "Match is already ended",
                        title: "Oppsss"
                    })
                } else {
                    //check declaration type 
                    if (type === 'beta-exec' && (USER.user?.name === 'beta-exec' || USER.user?.name === 'admin')) {
                        await match.updateOne({ id: { $eq: matchid } }, { $set: { declare: { initial: true } } })
                        return res.send({
                            status: false,
                            title: "Match initially declared",
                            message: "Awaiting Admin to confirm"
                        })
                    } else if (type === 'beta-admin' && (USER.user?.name === 'beta-admin' || USER.user?.name === 'admin')) {
                        const WINNER_TEAM_ID: string = teamid
                        if (MatchFound.teams.length <= 2) {
                            const SELECTED_TEAM_WINNER = MatchFound.teams.find((x) => x.id === WINNER_TEAM_ID)?.score as number
                            const NOT_SELECTED_TEAM_WINNER = MatchFound.teams.find((x) => x.id !== WINNER_TEAM_ID)?.score as number
                            if (SELECTED_TEAM_WINNER > NOT_SELECTED_TEAM_WINNER) {
                                const TOTAL_STAKES = MatchFound.bettors.reduce((sum, stake) => sum + stake.amount, 0)
                                const WINNER_TEAM_TOTAL_STAKES = MatchFound.bettors.reduce((sum, stake) => sum + (stake.teamid === WINNER_TEAM_ID ? stake.amount : 0), 0)
                                //get winners 
                                const params = await web3.algod.getTransactionParams().do()
                                MatchFound.bettors.map(async (bettor) => {
                                    if (bettor.teamid === WINNER_TEAM_ID) {
                                        const PERCENT = bettor.amount / WINNER_TEAM_TOTAL_STAKES * 100
                                        const PAYOUT = (PERCENT * TOTAL_STAKES) / 100
                                        const TOTAL_PAYOUT = config.percent(parseInt(process.env.NEXT_PUBLIC_PERCENT_DEDUCTION as string), PAYOUT) - parseFloat(process.env.FEE as string)
                                        profit += PAYOUT - TOTAL_PAYOUT
                                        //make tx
                                        const PAYMENT_TXN = web3.algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                                            from: SYSTEM_ACCOUNT.addr,
                                            to: bettor.address,
                                            amount: web3.algosdk.algosToMicroalgos(TOTAL_PAYOUT),
                                            note: new TextEncoder().encode(`Stake Reward\nMatch ID: ${MatchFound.id}\nStake Amount: ${bettor.amount.toFixed(2)}\nTotal Prize: ${TOTAL_PAYOUT.toFixed(2)}`),
                                            suggestedParams: params
                                        })
                                        winnersTx.push(PAYMENT_TXN.signTxn(SYSTEM_ACCOUNT.sk))
                                        //notification for user 
                                        const notification = {
                                            id: config.id(),
                                            type: 'reward',
                                            content: `You won ${TOTAL_PAYOUT} $ALGO`,
                                            matchid: MatchFound.id,
                                            created: parseInt(moment().format('x'))
                                        }
                                        await account.updateOne({ address: { $eq: bettor.address } }, { $push: { notifications: notification } })
                                    }
                                })
                                //send winners tx 
                                await web3.algod.sendRawTransaction(winnersTx).do()
                                //update match info 
                                await match.updateOne({ id: { $eq: matchid } }, {
                                    $set: {
                                        isDone: true,
                                        profit: profit,
                                        stakingEnded: parseInt(moment().format('x')),
                                        declare: { final: true }
                                    }
                                })
                                return res.send({
                                    status: true,
                                    title: 'Match Successfully Declared',
                                    message: `System Profit ${profit.toFixed(2)} $ALGO`
                                })
                            } else {
                                return res.send({
                                    status: false,
                                    title: "Oppps",
                                    message: "Winner Team invalid"
                                })
                            }
                        } else {
                            return res.send({
                                status: false,
                                title: "Oppps",
                                message: "Feature not available"
                            })
                        }
                    } else if (type === 'draw' && USER.user?.name === 'admin') {

                    } else {
                        return res.send({
                            status: false,
                            title: "Oppss",
                            message: "Invalid Match Declaration"
                        })
                    }
                }
            } else {
                return res.send({
                    status: false,
                    title: "Match not found",
                    message: "Please try again"
                })
            }
        } else {
            return res.status(401).send("Unauthorized")
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}