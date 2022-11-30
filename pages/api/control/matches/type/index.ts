import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from 'next-auth/react'
import { dbConnect, matchTypes } from "../../../../../models"
interface x extends NextApiRequest {
    method: "GET"
}
type Response = "Internal Server Error" | "Unauthorized" | any
export default async function Types(req: x, res: NextApiResponse<Response>) {
    const { method } = req
    const USER = await getSession({ req })
    try {
        if (method === 'GET' && USER) {
            await dbConnect()
            const DATA = await matchTypes.find()
            return res.send(DATA)
        } else {
            return res.status(401).send("Unauthorized")
        }
    } catch (e) {
        return res.status(500).send("Internal Server Error")
    }
}   