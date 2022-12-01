import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { dbConnect, team } from '../../../../models'
import moment from 'moment'
import match from '../../../../models/match'
import { config } from '../../../../lib'
interface x extends NextApiRequest {
    body: {
        teams: { id: string }[],
        start: string,
        type: string
    },
    method: 'POST'
}
type Response = {
    status: boolean,
    title?: string,
    message?: string
} | "Internal Server Error" | "Unauthorized"
export default async function CreateMatch(req: x, res: NextApiResponse<Response>) {
    const { method, body: { teams, start, type } } = req
    const USER = await getSession({ req })
    const isvalidUser = USER?.user?.name === 'admin'
    try {
        if (method === "POST" && isvalidUser) {
            await dbConnect()
            if (teams && start && type && teams.length >= 2) {
                const STAKING_START = moment(start).format("x")
                const NOW = moment().format("x")
                if (NOW < STAKING_START) {
                    const TEAMS = await team.find() 
                    const MATCH_TEAMS = teams.map((x) => {
                        return {
                            id: x.id,
                            logo: TEAMS.find(y => y.id === x.id)?.logo,
                            name: TEAMS.find(y => y.id === x.id)?.name,
                            score: 0
                        }
                    })
                    const NEW_MATCH = new match({
                        id: config.id(10),
                        teams: MATCH_TEAMS,
                        stakingStart: start,
                        matchType: type,
                        isDone: false,
                        matchNumber: null,
                        createdBy: USER.user?.name,
                        created: moment().format()
                    })
                    await NEW_MATCH.save()
                    return res.send({
                        status: true,
                        title: "Match Successfully Created",
                        message: `Staking will end in ${moment(start).fromNow()}`
                    })
                } else {
                    return res.send({
                        status: false,
                        title: "Invalid Date & Time",
                        message: "Staking Date & Time should be greater than the current time."
                    })
                }
            } else {
                return res.send({
                    status: false,
                    title: "Invalid Match",
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