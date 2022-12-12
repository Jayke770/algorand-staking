import mongoose from "mongoose"
type TxInfo = {
    id: string,
    txId: string,
    "confirmed-round": string,
    "pool-error": string,
    txn: {
        sig: Uint8Array,
        txn: {
            amt: number,
            fee: number,
            fv: number,
            gen: string,
            gh: Uint8Array,
            lv: number,
            note: Uint8Array,
            rcv: Uint8Array,
            snd: Uint8Array,
            type: string
        }
    }
}
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
        teamid: string,
        username: string
        amount: number,
        txInfo: TxInfo,
        created: string,
    }[],
    declare: {
        initial: boolean,
        final: boolean,
        by: string
    },
    comments: {
        commentId: string,
        message: string,
        created: string
    }[],
    stakingEnded: string,
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
        teamid: String,
        username: String,
        amount: Number,
        txInfo: Object,
        created: String,
    }],
    declare: {
        initial: { type: Boolean },
        final: { type: Boolean },
        by: { type: String }
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
    stakingEnded: { type: String },
    createdBy: { type: String, required: true },
    created: { type: Number, required: true },
})
if (mongoose.models['match'] != null) {
    mongoose.deleteModel('match')
}
export default mongoose.model<Match>('match', match)