import { Card, Button } from "konsta/react"
import moment from "moment"
import Logo from "../../Logo"
type props = {
    id: string,
    name: string,
    created: string,
    logo: string,
    onUpdate: (id: string, name: string, logo: string) => void,
    onDelete: (id: string) => void
}
export default function Team({ id, name, created, logo, onUpdate, onDelete }: props) {
    return (
        <div>
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
                            onClick={() => onUpdate(id, name, logo)}
                            small
                            rounded
                            tonal
                            className=' k-color-brand-teamdao-amber'>Update</Button>
                    </div>
                }>
                <div className='flex justify-center items-center'>
                    <Logo
                        className="w-full h-full h- drop-shadow-[rgb(42_254_48)_0px_0px_8px]"
                        src={logo}
                        size="w-40 h-40"
                        fill='fill-teamdao-primary/60'
                        padding={'md:p-1'} />
                </div>
                <div className='flex flex-col gap-2 mt-2'>
                    <div className='flex justify-between items-baseline'>
                        <span className='text-zinc-400'>ID:</span>
                        <span className='text-zinc-200'>{id}</span>
                    </div>
                    <div className='flex justify-between items-baseline'>
                        <span className='text-zinc-400'>Name:</span>
                        <span className='text-zinc-200'>{name}</span>
                    </div>
                    <div className='flex justify-between items-baseline'>
                        <span className='text-zinc-400'>Created:</span>
                        <span className='text-zinc-200'>{moment(created).fromNow()}</span>
                    </div>
                </div>
            </Card>
        </div>
    )
}