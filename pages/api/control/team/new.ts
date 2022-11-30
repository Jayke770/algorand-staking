import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { config } from '../../../../lib'
import { dbConnect, team } from '../../../../models'
import moment from 'moment'
interface x extends NextApiRequest {
    body: {
        name: string,
        logo: string
    },
    method: 'POST'
}
type Response = {
    status: boolean,
    title?: string,
    message?: string
} | "Internal Server Error" | "Unauthorized"
export default async function NewTeam(req: x, res: NextApiResponse<Response>) {
    const { method, body: { logo, name } } = req
    const USER = await getSession({ req })
    try {
        if (method === "POST" && USER) {
            await dbConnect()
            const isFound = await team.findOne({ name: { $eq: name } })
            if (isFound) {
                return res.send({
                    status: false,
                    title: 'Team already exist',
                    message: 'Please try again'
                })
            } else {
                const NEW_TEAM = new team({
                    id: config.id(10),
                    name: name,
                    logo: logo,
                    createdBy: USER?.user?.name,
                    created: moment().format()
                })
                await NEW_TEAM.save()
                return res.send({
                    status: true,
                    title: 'Team successfully saved'
                })
            }
            return res.status(401).send("Unauthorized")
        } else {
            return res.status(401).send("Unauthorized")
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}