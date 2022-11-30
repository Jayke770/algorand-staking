import mongoose from 'mongoose'
interface Types {
    name: string,
    emoji: string,
    gc: string,
    created: string,
    createdBy: string
}
const types = new mongoose.Schema<Types>({
    name: { type: String, required: true },
    emoji: { type: String, required: true },
    gc: { type: String, required: true },
    created: { type: String, required: true },
    createdBy: { type: String, required: true }
})
if (mongoose.models['match-types'] != null) {
    mongoose.deleteModel('match-types')
}
export default mongoose.model<Types>('match-types', types)