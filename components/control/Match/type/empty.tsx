import { Card } from "konsta/react"
export default function TypesEmpty() {
    return (
        <div className='col-span-full h-[calc(100vh-85px)] w-full flex justify-center items-center'>
            <Card
                raised
                className="w-3/5 md:w-[400px]"
                margin="m-0">
                <div className="flex justify-center items-center text-xl font-semibold">No Match Types Available</div>
            </Card>
        </div>
    )
}