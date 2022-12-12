type props = {
    src?: string,
    alt?: string,
    height: number
}
export default function TeamLogo({ src, alt, height }: props) {
    return (
        <div className="relative w-full flex justify-center items-center">
            <svg
                height={height | 0}
                viewBox="0 0 248 248"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle cx="124.102" cy="123.972" r="123.857" fill="#1C8521" />
            </svg>
            <div className=" absolute top-0 w-full h-full flex justify-center items-center">
                <img
                    loading='lazy'
                    src={src}
                    alt={alt}
                    className="rounded-full ring-teamdao-primary ring-4" />
            </div>
        </div>
    )
}