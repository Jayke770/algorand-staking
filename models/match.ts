import mongoose from "mongoose"
interface Match {
    id: string,
    teams: { id: string, score: number }[],
    stakingStart: string,
    winner: string,
    matchType: string,
    bettors: {
        betId: string,
        address: string,
        userid: string,
        username: string
        amount: number,
        created: string,
    }[],
    declare: {
        initial: boolean,
        final: boolean
    },
    comments: {
        commentId: string,
        message: string,
        created: string
    }[],
    isDone: boolean,
    matchNumber: number,
    profit: number,
    shareLink: string,
    liveLink: string,
    createdBy: string,
    created: string,
}
const match = new mongoose.Schema<Match>({
    id: { type: String, required: true },
    teams: [{
        id: String,
        score: Number
    }],
    stakingStart: { type: String, required: true },
    winner: { type: String, required: true },
    matchType: { type: String, required: true },
    bettors: [{
        betId: String,
        address: String,
        userid: String,
        username: String,
        amount: Number,
        created: String,
    }],
    declare: {
        initial: { type: Boolean, required: true },
        final: { type: Boolean, required: true }
    },
    comments: [{
        commentId: String,
        message: String,
        created: String
    }],
    isDone: { type: Boolean, required: true },
    matchNumber: { type: Number, required: true },
    profit: { type: Number, required: true },
    shareLink: { type: String, required: true },
    liveLink: { type: String, required: true },
    createdBy: { type: String, required: true },
    created: { type: String, required: true },
})
if (mongoose.models['match'] != null) {
    mongoose.deleteModel('match')
}
export default mongoose.model<Match>('match', match)