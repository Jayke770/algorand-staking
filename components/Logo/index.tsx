import React from 'react'
type HexagonType = {
    alt?: string,
    src?: string,
    className?: string,
    size?: string,
    fill?: string,
    padding: string,
    onClick?: () => void
}
export default function Hexagon(props: HexagonType) {
    return (
        <div
            onClick={props.onClick}
            className={`relative z-10 transition-all cursor-pointer ${props.size}`}>
            <svg
                className={`${props.className} transition-all`}
                viewBox="0 0 173.20508075688772 200">
                <path
                    className={props.fill}
                    d="M82.27241335952166 2.4999999999999996Q86.60254037844386 0 90.93266739736606 2.4999999999999996L168.87495373796554 47.5Q173.20508075688772 50 173.20508075688772 55L173.20508075688772 145Q173.20508075688772 150 168.87495373796554 152.5L90.93266739736606 197.5Q86.60254037844386 200 82.27241335952166 197.5L4.330127018922194 152.5Q0 150 0 145L0 55Q0 50 4.330127018922194 47.5Z">
                </path>
            </svg>
            <div className={`absolute z-5 top-0 bottom-0 h-full w-full flex justify-center items-center ${props.padding}`}>
                <img
                    className="object-cover -m-4"
                    alt={props.alt}
                    src={props.src} />
            </div>
        </div >
    )
}