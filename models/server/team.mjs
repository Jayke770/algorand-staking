import mongoose from 'mongoose'
const team = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    logo: { type: String, required: true },
    createdBy: { type: String, required: true },
    created: { type: String, required: true }
})
if (mongoose.models['team'] != null) {
    mongoose.deleteModel('team')
}
export default mongoose.model('team', team)