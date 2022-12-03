import mongoose from "mongoose"
interface Match {
    id: string,
    teams: {
        id: string,
        name: string,
        logo: string,
        score: number
    }[],
    stakingStart: number,
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
    created: Number,
}
const match = new mongoose.Schema<Match>({
    id: { type: String, required: true },
    teams: [{
        id: String,
        name: String,
        logo: String,
        score: Number
    }],
    stakingStart: { type: Number, required: true },
    winner: { type: String },
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
        initial: { type: Boolean },
        final: { type: Boolean }
    },
    comments: [{
        commentId: String,
        message: String,
        created: String
    }],
    isDone: { type: Boolean, required: true },
    matchNumber: { type: Number },
    profit: { type: Number },
    shareLink: { type: String },
    liveLink: { type: String },
    createdBy: { type: String, required: true },
    created: { type: Number, required: true },
})
if (mongoose.models['match'] != null) {
    mongoose.deleteModel('match')
}
export default mongoose.model<Match>('match', match)