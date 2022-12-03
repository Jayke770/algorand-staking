import { Preloader } from "konsta/react"
export default function MatchLoader() {
    return (
        <div className="col-span-full flex h-[calc(100vh-150px)] md:h-[calc(100vh-165px)] w-full justify-center items-center">
            <Preloader className=" k-color-brand-teamdao-primary" />
        </div>
    )
}