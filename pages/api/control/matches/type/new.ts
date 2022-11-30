import type { NextApiResponse, NextApiRequest } from "next"
import { dbConnect, matchTypes } from '../../../../../models'
import { getSession } from 'next-auth/react'
import moment from "moment"
interface x extends NextApiRequest {
    body: {
        name: string,
        emoji: string,
        gc: string
    },
    method: "POST"
}
type Response = {
    status: boolean,
    title?: string,
    message?: string
} | "Internal Server Error" | "Unauthorized"
export default async function NewMatchType(req: x, res: NextApiResponse<Response>) {
    const { method, body: { name, gc, emoji } } = req
    const USER = await getSession({ req })
    try {
        if (method === 'POST' && USER) {
            await dbConnect()
            const isFound = await matchTypes.findOne({ name: { $eq: name } })
            if (isFound) {
                return res.send({
                    status: false,
                    title: "Match Type already exist",
                    message: "Please try again"
                })
            } else {
                const NEW_MATCH_TYPE = new matchTypes({
                    name: name.trim(),
                    gc: gc,
                    emoji: emoji,
                    created: moment().format(),
                    createdBy: USER.user?.name
                })
                await NEW_MATCH_TYPE.save()
                return res.send({
                    status: true,
                    title: "Match Type sucessfully saved"
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