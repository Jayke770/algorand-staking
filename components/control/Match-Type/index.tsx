import { Card, Button } from "konsta/react"
type props = {
    id: string,
    name: string,
    emoji: string,
    gc: string,
    onDelete: (id: string) => void,
    onUpdate: (id: string, name: string, gc: string) => void
}
export default function MatchType({ id, name, emoji, gc, onDelete, onUpdate }: props) {
    return (
        <Card
            raised
            margin="m-0"
            footer={
                <div className='grid grid-cols-2 gap-2'>
                    <Button
                        onClick={() => onDelete(id)}
                        small
                        rounded
                        tonal
                        className=' k-color-brand-teamdao-red'>Delete</Button>
                    <Button
                        onClick={() => onUpdate(id, name, emoji)}
                        small
                        rounded
                        tonal
                        className=' k-color-brand-teamdao-amber'>Update</Button>
                </div>
            }>
            <div className='flex flex-col gap-2'>
                <div className='flex justify-between items-baseline'>
                    <span className=' text-zinc-400'>Type</span>
                    <span className='font-semibold'>{name}</span>
                </div>
                <div className='flex justify-between items-baseline'>
                    <span className=' text-zinc-400'>Emoji</span>
                    <span className='font-semibold'>{emoji}</span>
                </div>
                <div className='flex justify-between items-baseline'>
                    <span className=' text-zinc-400'>Group Chat ID</span>
                    <span className='font-semibold'>{gc}</span>
                </div>
            </div>
        </Card>
    )
}