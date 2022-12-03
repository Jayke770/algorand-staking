type props = {
    alt: string,
    src: string,
    border: string,
    selected?: boolean,
    isWinner?: boolean,
    isDone?: boolean
}
export default function SmallLogo({ alt, src, border, selected, isWinner, isDone }: props) {
    return (
        isDone ? (
            <div className={`hexagon_small ${isWinner ? 'after:border-l-primary before:border-t-primary after:border-b-primary before:border-r-primary !border-x-primary  shadow-[0_0_20px] shadow-primary' : 'after:border-l-zinc-400 before:border-t-zinc-400 after:border-b-zinc-400 before:border-r-zinc-400 !border-x-zinc-400'}`}>
                <img
                    alt={alt}
                    src={src}
                    className={`h-14 w-full object-cover z-50 p-0.5`}
                    loading="lazy" />
            </div>
        ) : (
            <div className={`hexagon_small ${selected ? 'after:border-l-primary before:border-t-primary after:border-b-primary before:border-r-primary !border-x-primary' : border}`}>
                <img
                    alt={alt}
                    src={src}
                    className={`h-14 w-full object-cover p-0.5`}
                    loading="lazy" />
            </div>
        )
    )
}