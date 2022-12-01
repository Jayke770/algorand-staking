import { Preloader } from "konsta/react"
export default function MatchLoader() {
    return (
        <div className="col-span-full flex h-full w-full justify-center items-center">
            <Preloader className=" k-color-brand-teamdao-primary" />
        </div>
    )
}