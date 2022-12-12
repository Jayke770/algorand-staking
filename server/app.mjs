import App from './settings.mjs'
import dbConnect from '../models/connect.mjs'
import team from '../models/server/team.mjs'
import matchTypes from '../models/server/match-types.mjs'
App.ControlWs.on('connection', (socket) => {
    console.log('fgsafafasfsa', socket.id)
    socket.on('more-teams', async ({ ignore }, cb) => {
        if (ignore.length > 0) {
            await dbConnect()
            const DATA = await team.find({ $and: ignore }).sort({ _id: -1 }).limit(10)
            cb({ data: DATA })
        } else {
            cb({ data: null })
        }
    })
    socket.on("search-team", async ({ search }, cb) => {
        if (search) {
            await dbConnect()
            const DATA = await team.find({
                $or: [
                    { id: new RegExp(`.*${search.toUpperCase()}.*`) },
                    { name: new RegExp(`.*${search}.*`) }
                ]
            })
            cb({ data: DATA })
        } else {
            cb({ data: null })
        }
    })
    socket.on("match-types", async ({ }, cb) => {
        await dbConnect()
        const DATA = await matchTypes.find()
        cb(DATA)
    })
})
App.httpServer.listen(App.port, () => {
    console.log(`> Server Started on port ${App.port} as ${process.env.NODE_ENV}`)
})