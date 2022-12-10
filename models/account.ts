import mongoose from 'mongoose'
interface Account {
    avatar: string,
    ip: string,
    device: string,
    address: string,
    created: number
}
const account = new mongoose.Schema<Account>({
    avatar: { type: String, required: true },
    ip: { type: String, required: true },
    device: { type: String, required: true },
    address: { type: String, required: true },
    created: { type: Number, required: true }
})
if (mongoose.models['account'] != null) {
    mongoose.deleteModel('account')
}
export default mongoose.model<Account>('account', account)