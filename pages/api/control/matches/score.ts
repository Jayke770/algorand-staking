import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from 'next-auth/react'
import { dbConnect, match, team } from "../../../../models"
interface x extends NextApiRequest {
    body: {
        matchid: string,
        teamid: string,
        score: number
    },
    method: 'POST'
}
type Response = {
    status: boolean,
    title?: string,
    message?: string
} | "Internal Server Error" | "Unauthorized"
export default async function Score(req: x, res: NextApiResponse<Response>) {
    const { method, body: { matchid, teamid, score } } = req
    const USER = await getSession({ req })
    try {
        if (USER && method === 'POST') {
            //check body key 
            if (matchid && teamid && score) {
                await dbConnect()
                //check match if exist 
                const isMatchFound = await match.findOne({
                    $and: [
                        { id: { $eq: matchid } },
                        { teams: { $elemMatch: { id: { $eq: teamid } } } },
                        { isDone: false }
                    ]
                })
                if (isMatchFound) {
                    //update score 
                    await match.updateOne({ id: { $eq: matchid }, teams: { $elemMatch: { id: teamid } } }, { $set: { "teams.$.score": score } })
                    return res.send({
                        status: true,
                        title: "Score Successfully Updated"
                    })
                } else {
                    return res.send({
                        status: false,
                        title: 'Oppss',
                        message: "Match not found"
                    })
                }
            } else {
                return res.send({
                    status: false,
                    title: 'Opps',
                    message: "Match ID, Team ID & Score is required"
                })
            }
        } else {
            return res.status(401).send("Unauthorized")
        }
    } catch (e) {
        return res.status(500).send("Internal Server Error")
    }
}