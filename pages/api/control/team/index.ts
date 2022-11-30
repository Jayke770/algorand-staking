import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { dbConnect, team } from '../../../../models'
interface x extends NextApiRequest {
    method: 'GET'
}
type Response = "Internal Server Error" | "Unauthorized"
export default async function Teams(req: x, res: NextApiResponse<Response>) {
    const { method } = req
    const USER = await getSession({ req })
    try {
        if (method === 'GET' && USER) {
            await dbConnect()
            const data = await team.find().limit(10).sort({ _id: -1 })
            //@ts-ignore
            return res.send(data)
        } else {
            return res.status(401).send("Unauthorized")
        }
    } catch (e) {
        return res.status(500).send("Internal Server Error")
    }
}   