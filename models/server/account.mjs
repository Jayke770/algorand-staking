import mongoose from 'mongoose'
const account = new mongoose.Schema({
    avatar: { type: String, required: true },
    ip: { type: String, required: true },
    wallet: { type: String, required: true },
    device: { type: String, required: true },
    address: { type: String, required: true },
    created: { type: Number, required: true }
})
if (mongoose.models['account'] != null) {
    mongoose.deleteModel('account')
}
export default mongoose.model('account', account)