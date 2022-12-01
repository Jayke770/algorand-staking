import type { NextApiResponse, NextApiRequest } from "next"
import { getSession } from "next-auth/react"
import { dbConnect } from "../../../../models"
import match from "../../../../models/match"
interface x extends NextApiRequest {
    method: 'GET'
}
type Response = any[] | "Internal Server Error" | "Unauthorized"
export default async function Matches(req: x, res: NextApiResponse<Response>) {
    const { method } = req
    const USER = await getSession({ req })
    try {
        if (method === 'GET' && USER) {
            await dbConnect()
            const MATCHES = await match.find().sort('desc')
            return res.send(MATCHES)
        } else {
            return res.status(401).send("Unauthorized")
        }
    } catch (e) {
        return res.status(500).send("Internal Server Error")
    }
}