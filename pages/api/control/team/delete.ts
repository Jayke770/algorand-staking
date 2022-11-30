import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { dbConnect, team } from '../../../../models'
interface x extends NextApiRequest {
    method: 'POST',
    body: {
        id: string
    }
}
type Response = {
    status: boolean,
    title?: string,
    message?: string
} | "Internal Server Error" | "Unauthorized"
export default async function Teams(req: x, res: NextApiResponse<Response>) {
    const { method, body: { id } } = req
    const USER = await getSession({ req })
    try {
        if (method === 'POST' && USER) {
            await dbConnect()
            await team.deleteOne({ id: { $eq: id } })
            return res.send({
                status: true,
                title: "Team successfully deleted"
            })
        } else {
            return res.status(401).send("Unauthorized")
        }
    } catch (e) {
        return res.status(500).send("Internal Server Error")
    }
}   