import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 12)
const config = {
    id: (size?: number): string => {
        return nanoid(size || 12)
    },
    percent: (percent: number, value: number): number => {
        return parseFloat((value - ((percent / 100) * value)).toFixed(2))
    },
    substr: (str?: string): string => {
        return str ? `${str.substring(0, 5)}***${str.substring(str.length - 5)}` : ''
    }
}
export default config