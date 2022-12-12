import type { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect, account } from '../../../../models'
import requestIp from 'request-ip'
import moment from 'moment'
interface x extends NextApiRequest {
    query: {
        info: string[]
    }
    method: "GET"
}
type Response = {
    address: string,
    wallet: string,
    avatar: string,
    created: number
} | "Internal Server Error" | "Unauthorized"
export default async function Account(req: x, res: NextApiResponse<Response>) {
    const { method, query: { info }, headers } = req
    const clientIp = requestIp.getClientIp(req)
    try {
        if (method === "GET" && info.length > 0) {
            await dbConnect()
            const isAddressFound = await account.findOne({ address: { $eq: info[0] } }, { _id: 0, ip: 0, device: 0 })
            if (isAddressFound) {
                return res.send(isAddressFound)
            } else {
                //create 
                const NEW_ACCOUNT_DATA = {
                    address: info[0],
                    wallet: info[1],
                    device: headers['user-agent'],
                    ip: clientIp,
                    avatar: `https://www.gravatar.com/avatar/${Math.floor(Math.random() * 99999999999999)}?d=retro`,
                    created: parseInt(moment().format("x"))
                }
                const NEW_ACCOUNT = new account(NEW_ACCOUNT_DATA)
                await NEW_ACCOUNT.save()
                return res.send({
                    address: NEW_ACCOUNT_DATA.address,
                    wallet: NEW_ACCOUNT_DATA.wallet,
                    avatar: NEW_ACCOUNT_DATA.avatar,
                    created: NEW_ACCOUNT_DATA.created
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