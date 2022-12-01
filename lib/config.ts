import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 12)
const config = {
    id: (size?: number): string => {
        return nanoid(size || 12)
    }
}
export default config