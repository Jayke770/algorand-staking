import mongoose from 'mongoose'
interface Team {
    id: string,
    name: string,
    logo: string,
    createdBy: string,
    created: string
}
const team = new mongoose.Schema<Team>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    logo: { type: String, required: true },
    createdBy: { type: String, required: true },
    created: { type: String, required: true }
})
if (mongoose.models['team'] != null) {
    mongoose.deleteModel('team')
}
export default mongoose.model<Team>('team', team)