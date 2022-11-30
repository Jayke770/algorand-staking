import { Preloader } from "konsta/react"
export default function TeamLoader() {
    return (
        <div className='col-span-full h-[calc(100vh-85px)] w-full flex justify-center items-center'>
            <Preloader className=' k-color-brand-teamdao-primary' />
        </div>
    )
}