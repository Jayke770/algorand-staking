import mongoose from 'mongoose'
const types = new mongoose.Schema({
    name: { type: String, required: true },
    emoji: { type: String, required: true },
    gc: { type: String, required: true },
    created: { type: String, required: true },
    createdBy: { type: String, required: true }
})
if (mongoose.models['match-types'] != null) {
    mongoose.deleteModel('match-types')
}
export default mongoose.model('match-types', types)