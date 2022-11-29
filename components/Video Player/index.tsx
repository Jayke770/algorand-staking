import ReactPlayer from "react-player"
export default function VideoPlayer({ src }: { src: string }) {
    return (
        <ReactPlayer
            playing={true}
            width="100%"
            height="100%"
            controls
            url={src}>
        </ReactPlayer>
    )
}