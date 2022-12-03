import { Card } from "konsta/react"
import CountUp from "react-countup"
import Link from 'next/link'
type props = {
    match: {
        _id?: string,
        __v: any,
        id: string,
        teams: {
            id: string,
            name: string,
            logo: string,
            score: number
        }[],
        stakingStart: string,
        winner: string,
        matchType: string,
        bettors: {
            betId: string,
            address: string,
            userid: string,
            username: string
            amount: number,
            created: string,
        }[],
        declare: {
            initial: boolean,
            final: boolean
        },
        comments: {
            commentId: string,
            message: string,
            created: string
        }[],
        isDone: boolean,
        matchNumber: number,
        profit: number,
        shareLink: string,
        liveLink: string,
        createdBy: string,
        created: string,
    },
    isNormalMatch: boolean
}
interface TeamsCustom {
    name: string,
    src: string
}
export default function MatchCard({ match, isNormalMatch }: props) {
    return (
        <Link href={isNormalMatch ? `/control/matches/${match.id}` : `/control/matches/custom/${match.id}`}>
            <Card
                className="h-full"
                raised
                margin="m-0"
                contentWrapPadding="p-2">
                {isNormalMatch ? (
                    <div className="grid grid-cols-3">
                        <div className="flex flex-col gap-2 justify-center items-center">
                            <img
                                loading="lazy"
                                src={match.teams[0].logo}
                                alt={match.teams[0].name}
                                className="w-18 h-18" />
                            <div className="">{match.teams[0].name}</div>
                        </div>
                        <div className="flex gap-3 justify-center items-center">
                            <CountUp className="text-xl text-teamdao-primary" start={0} end={match.teams[0].score} />
                            <div className="text-3xl font-bold tracking-wider text-red-600">VS</div>
                            <CountUp className="text-xl text-teamdao-primary" start={0} end={match.teams[1].score} />
                        </div>
                        <div className="flex flex-col gap-2 justify-center items-center">
                            <img
                                loading="lazy"
                                src={match.teams[1].logo}
                                alt={match.teams[1].name}
                                className="w-18 h-18" />
                            <div className="">{match.teams[1].name}</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center h-full items-center">
                        <div className="flex gap-2 py-1 px-2">
                            {match.teams.length > 7 ? (
                                <>
                                    {match.teams.slice(0, 4).map((team, i) => (
                                        <img
                                            key={i}
                                            className="w-16 h-16 object-contain"
                                            src={team.logo}
                                            alt={team.name} />
                                    ))}
                                    <div className="flex justify-center items-center">
                                        <span className="text-xs">+{match.teams.length - 4} Teams</span>
                                    </div>
                                </>
                            ) : (
                                match.teams.map((team, i) => (
                                    <img
                                        key={i}
                                        className="w-16 h-16 object-contain"
                                        src={team.logo}
                                        alt={team.name} />
                                ))
                            )}
                        </div>
                    </div>
                )}
            </Card>
        </Link>
    )
}