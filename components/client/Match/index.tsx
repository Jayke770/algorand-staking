import { Card, List, ListItem, Popover } from 'konsta/react'
import NextLink from 'next/link'
import { SmallLogo } from '../../'
import { CustomTeams } from '../'
import Link from 'next/link'
import { team } from '../../../models'
import Countdown from 'react-countdown'
import CountUp from 'react-countup'
import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
const border = {
    blue: "after:border-l-blue-500 before:border-t-blue-500 after:border-b-blue-500 before:border-r-blue-500 !border-x-blue-500",
    pink: "after:border-l-pink-500 before:border-t-pink-500 after:border-b-pink-500 before:border-r-pink-500 !border-x-pink-500"
}
type props = {
    match: {
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
        shareLink: string,
        liveLink: string,
        created: string,
    },
    isNormalMatch: boolean,
    index: number
}
export default function MatchCard({ match, isNormalMatch, index }: props) {
    const router = useRouter()
    const [MoreTeams, SetMoreTeams] = useState<boolean>(false)
    const moreTeam = useRef<HTMLDivElement | null>(null)
    const _countdown = ({ days, hours, minutes, seconds, completed }: { days: number, hours: number, minutes: number, seconds: number, completed: boolean }) => {
        if (completed) {
            return <span className='text-center dark:text-orange-500'>🔴LIVE</span>
        } else {
            return <span className='text-center dark:text-teamdao-primary'>{days < 10 && days !== 0 ? `0${days}` : days}D {hours < 10 && hours !== 0 ? `0${hours}` : hours}:{minutes < 10 && minutes !== 0 ? `0${minutes}` : minutes}:{seconds < 10 && seconds !== 0 ? `0${seconds}` : seconds}</span>
        }
    }
    const _check = (e: any): void => {
        const event: MouseEvent = e
        //@ts-ignore
        event.target?.id === "more-team" ? SetMoreTeams(true) : router.push(`/matches/${match.id}`)
    }
    return (
        <>
            <Card
                onClick={_check}
                className={`h-[108.48px] cursor-pointer border-t border-l rounded-lg ${index % 2 === 0 ? 'border-red-600' : 'border-blue-600'} `}
                margin="m-0"
                contentWrap={false}>
                <div className='grid grid-cols-7 h-full text-sm py-2 px-1'>
                    {isNormalMatch ? (
                        <div className='col-span-4 grid grid-cols-3 py-0.5'>
                            <SmallLogo
                                alt={match.teams[0].name}
                                src={match.teams[0].logo}
                                border={border.blue}
                                isDone={false}
                                selected={false}
                                isWinner={false} />
                            <div className='flex justify-center items-end -mb-2'>
                                <div className='text-white font-bold tracking-widest text-3xl'>VS</div>
                            </div>
                            <SmallLogo
                                alt={match.teams[0].name}
                                src={match.teams[0].logo}
                                border={border.pink}
                                isDone={false}
                                selected={false}
                                isWinner={false} />
                            <div className='col-span-full grid grid-cols-3 mt-5'>
                                <div className='flex justify-center gap-1'>
                                    <span className='text-white'>1 =</span>
                                    <span className='text-teamdao-primary'>99</span>
                                </div>
                                <br />
                                <div className='flex justify-center gap-1'>
                                    <span className='text-white'>1 =</span>
                                    <span className='text-red-500'>99</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='col-span-4 flex flex-col h-full w-full justify-center pt-2.5'>
                            {match.teams.length < 5 ? (
                                <div className={`gap-2 w-full flex pl-5`}>
                                    {match.teams.map((team) => (
                                        <img
                                            key={team.name}
                                            className={`inline-flex w-10 h-10 relative dark:bg-blue-700 rounded-full object-contain ring-2 ring-white`}
                                            src={team.logo}
                                            alt={team.name} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-wrap items-center gap-2 pl-5">
                                    {match.teams.length > 8 ? (
                                        <>
                                            {match.teams.slice(0, 4).map((team) => (
                                                <img
                                                    key={team.name}
                                                    className={`inline-flex w-10 h-10 first:ml-0 -ml-4 relative dark:bg-blue-700 rounded-full object-contain ring-2 ring-white`}
                                                    src={team.logo}
                                                    alt={team.name} />
                                            ))}
                                            <div
                                                ref={moreTeam}
                                                onClick={_check}
                                                id="more-team"
                                                className="inline-flex relative justify-center items-center w-10 h-10 first:ml-0 -ml-4 hover:bg-red-600 dark:bg-blue-700 rounded-full object-contain ring-2 ring-white">
                                                <p className="text-center pointer-events-none font-semibold text-base"> +{match.teams.length - 4}</p>
                                            </div>
                                        </>
                                    ) : (
                                        match.teams.map((team) => (
                                            <img
                                                key={team.name}
                                                className={`inline-flex w-10 h-10 first:ml-0 -ml-4 relative dark:bg-blue-700 rounded-full object-contain ring-2 ring-white`}
                                                src={team.logo}
                                                alt={team.name} />
                                        ))
                                    )}
                                </div>
                            )}
                            <div className='grid grid-cols-3 mt-5 w-full'>
                                <div className='flex justify-center gap-1'>
                                    <span className='text-white'>1 =</span>
                                    <span className='text-teamdao-primary'>99</span>
                                </div>
                                <br />
                                <div className='flex justify-center gap-1'>
                                    <span className='text-white'>1 =</span>
                                    <span className='text-red-500'>99</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='col-span-3 h-full flex gap-1 justify-center flex-col pr-2'>
                        <div className='flex justify-between items-baseline w-full'>
                            <span>Game:</span>
                            <span className=' text-teamdao-primary'>{match.matchType}</span>
                        </div>
                        <div className='text-xs flex justify-between items-baseline w-full'>
                            <span>Prize Pool:</span>
                            <CountUp
                                className='text-teamdao-primary'
                                start={0}
                                end={match.bettors?.reduce((sum, x) => sum + x.amount, 0)}
                                suffix=" $ALGO" />
                        </div>
                        <div className='flex text-xs justify-between items-baseline w-full'>
                            <span>Starting in:</span>
                            <Countdown
                                className='text-teamdao-primary'
                                date={match.stakingStart}
                                renderer={_countdown} />
                        </div>
                    </div>
                </div>
            </Card>
            <Popover
                opened={MoreTeams}
                onBackdropClick={() => SetMoreTeams(false)}
                target={moreTeam?.current}>
                <List
                    margin='m-0'
                    className='max-h-96 overflow-auto'>
                    {match.teams.map((x) => (
                        <ListItem
                            key={x.name}
                            title={x.name}
                            media={
                                <img
                                    alt={x.name}
                                    src={x.logo}
                                    className="w-10 h-10" />
                            }
                            after={
                                <span className='text-teamdao-primary'>{x.score}</span>
                            } />
                    ))}
                </List>
            </Popover>
        </>
    )
}