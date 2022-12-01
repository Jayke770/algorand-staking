import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { dbConnect } from '../../../../models'
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
        } else {
            return res.status(401).send("Unauthorized")
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}