import mongoose from 'mongoose'
interface Account {
    avatar: string,
    ip: string,
    wallet: string,
    device: string,
    address: string,
    notifications: {
        id: string,
        type: string,
        content: string,
        matchid: string,
        created: number
    }[],
    created: number
}
const account = new mongoose.Schema<Account>({
    avatar: { type: String, required: true },
    ip: { type: String, required: true },
    wallet: { type: String, required: true },
    device: { type: String, required: true },
    notifications: [{
        id: { type: String, required: true },
        type: { type: String, required: true },
        content: { type: String, required: true },
        matchid: { type: String, required: true },
        created: { type: Number, required: true },
    }],
    address: { type: String, required: true },
    created: { type: Number, required: true }
})
if (mongoose.models['account'] != null) {
    mongoose.deleteModel('account')
}
export default mongoose.model<Account>('account', account)