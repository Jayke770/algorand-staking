import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { dbConnect, team } from '../../../../models'
interface x extends NextApiRequest {
    method: 'POST',
    body: {
        id: string,
        logo: string,
        name: string
    }
}
type Response = {
    status: boolean,
    title?: string,
    message?: string
} | "Internal Server Error" | "Unauthorized"
export default async function Teams(req: x, res: NextApiResponse<Response>) {
    const { method, body: { id, name, logo } } = req
    const USER = await getSession({ req })
    try {
        if (method === "POST" && USER) {
            await dbConnect()
            const isFound = await team.findOne({ id: { $eq: id } })
            if (isFound) {
                await team.updateOne({ id: { $eq: id } }, { $set: { name: name, logo: logo } }).then(() => {
                    return res.send({
                        status: true,
                        title: "Team successfully updated"
                    })
                }).catch((e) => {
                    throw new Error(e)
                })
            } else {
                return res.send({
                    status: false,
                    title: "Team not found",
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