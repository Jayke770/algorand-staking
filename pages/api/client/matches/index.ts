//@ts-nocheck
import moment from "moment"
import type { NextApiResponse, NextApiRequest } from "next"
import { dbConnect } from "../../../../models"
import match from "../../../../models/match"
interface x extends NextApiRequest {
    method: 'GET'
}
type Response = any | "Internal Server Error" | "Unauthorized"
type Match = {
    __v: any,
    id: string,
    teams: { id: string, name: string, logo: string, score: number }[],
    stakingStart: number,
    winner: string,
    matchType: string,
    bettors: {
        betId: string,
        address: string,
        userid: string,
        username: string
        amount: number,
        created: string,
    }[],
    declare: {
        initial: boolean,
        final: boolean
    },
    comments: {
        commentId: string,
        message: string,
        created: string
    }[],
    isDone: boolean,
    matchNumber: number,
    shareLink: string,
    liveLink: string,
    created: number,
}
type Result = {
    yesterday: Match[],
    today: Match[],
    tomorrow: Match[],
    totalMatch: number
}
export default async function Matches(req: x, res: NextApiResponse<Response>) {
    const { method } = req
    const TODAY = parseInt(moment().subtract(2, 'days').format("x"))
    let result: Result = {
        yesterday: [],
        today: [],
        tomorrow: [],
        totalMatch: 0
    }
    try {
        if (method === "GET") {
            await dbConnect()
            const MATCHES = await match.find({ $or: [{ stakingStart: { $gte: TODAY } }, { isDone: false }] }, { _id: 0, profit: 0, createdBy: 0 }).sort({ _id: "desc" })
            result.totalMatch = MATCHES.length
            MATCHES.map((x) => {
                if (moment().isSame(x.stakingStart, 'day')) {
                    result.today.push(x)
                }
                if (moment().isAfter(x.stakingStart, 'day')) {
                    result.yesterday.push(x)
                }
                if (moment().isBefore(x.stakingStart, 'day')) {
                    result.tomorrow.push(x)
                }
            })
            return res.send(result)
        } else {
            return res.status(401).send("Unauthorized")
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}