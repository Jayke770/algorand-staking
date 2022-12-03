import { Navbar, Page, Link, Card, Button, List, ListItem } from "konsta/react"
import Head from "next/head"
import NextLink from 'next/link'
import { MdArrowBack } from "react-icons/md"
import { Logo, Player } from "../../components"
import { MdAdd, MdRemove, MdSend } from 'react-icons/md'
import { FaPaperPlane } from 'react-icons/fa'
import type { GetServerSideProps } from 'next'
import { dbConnect, match } from '../../models'
import { useContext, useEffect, useState } from "react"
import { wsClient } from '../../lib/client'
interface Match {
    __v: any,
    id: string,
    teams: { id: string, name: string, logo: string, score: number }[],
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
}
interface Stake {
    matchid?: string,
    teamid?: string,
    amount?: number
}
export default function Match({ data }: { data: any }) {
    const socket = useContext(wsClient)
    const [matchData, setMatchData] = useState<Match>(JSON.parse(data))
    const [stake, setStake] = useState<Stake>()
    useEffect(() => {
        socket.emit("join-match-room", { id: matchData.id })
        //new match bettor 
        socket.on("match-bettor", (match) => setMatchData(match))
        return () => {
            socket.off("join-match-room")
            socket.off("match-bettor")
        }
    }, [])
    return (
        <Page>
            <Head>
                <title>Match Info</title>
            </Head>
            <Navbar
                colors={{
                    textMaterial: 'text-teamdao-primary'
                }}
                title="Matches"
                left={
                    <NextLink href={"/matches"}>
                        <Link
                            navbar
                            component="div"
                            className=" k-color-brand-teamdao-primary">
                            <MdArrowBack
                                className="text-teamdao-primary"
                                size={'1.75rem'} />
                        </Link>
                    </NextLink>
                } />
            <div className="flex flex-col lg:flex-row p-4 gap-3">
                <div className="flex lg:flex-[30%]">
                    <div className="flex w-full flex-col gap-2">
                        {/* stake logo */}
                        <Card
                            margin="m-0"
                            className="w-full">
                            <div className="grid grid-cols-3 justify-center items-center gap-1 p-1">
                                <div className="flex justify-center items-center">
                                    <Logo
                                        className="w-full h-full drop-shadow-[rgb(59_130_246)_0px_0px_8px] "
                                        src="https://raw.githubusercontent.com/Jayke770/teamdao-staking-icons/master/teamdao_mlbb/JULIET1.png"
                                        size="w-full xl:h-36 lg:h-30"
                                        fill="fill-md-dark-surface-1"
                                        padding={'md:p-3'}
                                        onClick={() => console.log('fas')} />
                                </div>
                                <div className="flex justify-center items-center">
                                    <p className="text-5xl dark:text-red-600 tracking-wider font-bold font-evil-empire">VS</p>
                                </div>
                                <div className="flex justify-center items-center">
                                    <Logo
                                        className="w-full h-full drop-shadow-[rgb(236_72_153)_0px_0px_8px]"
                                        src="https://raw.githubusercontent.com/Jayke770/teamdao-staking-icons/master/teamdao_mlbb/JULIET1.png"
                                        size="w-full xl:h-36 lg:h-30"
                                        fill="fill-md-dark-surface-1"
                                        padding={'md:p-3'}
                                        onClick={() => console.log('fas')} />
                                </div>
                            </div>
                            <div className="flex flex-col mt-6 gap-3">
                                <div className="grid grid-cols-3">
                                    <div className="flex justify-center items-center">
                                        <span className="text-center font-teamdao tracking-widest text-2xl font-bold text-white">TEAM fsaffs fsafassf</span>
                                    </div>
                                    <div />
                                    <div className="flex justify-center items-center">
                                        <span className="text-center font-teamdao tracking-widest text-2xl font-bold text-white">TEAM</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 px-3">
                                    <div className="flex justify-between items-baseline">
                                        <span>Stake Amount:</span>
                                        <span className=" text-teamdao-primary">1 TEAM</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span>Est. Prize:</span>
                                        <span className=" text-teamdao-primary">1 TEAM</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span>Est. Earnings (-1%):</span>
                                        <span className=" text-teamdao-primary">1 TEAM</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        {/* stake card */}
                        <Card
                            margin="m-0">
                            <div className="flex justify-between">
                                <div className="font-semibold text-lg flex justify-center items-center">
                                    1 $ALGO
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        small
                                        className="w-auto !px-2 k-color-brand-teamdao-red">
                                        <MdRemove
                                            size={'1.25rem'} />
                                    </Button>
                                    <Button
                                        small
                                        className="w-auto !px-2 k-color-brand-teamdao-blue">
                                        ALL IN
                                    </Button>
                                    <Button
                                        small
                                        className="w-auto !px-2 k-color-brand-teamdao-primary">
                                        <MdAdd size={'1.25rem'} />
                                    </Button>
                                </div>
                            </div>
                            <Button
                                className="mt-3 k-color-brand-teamdao-primary">
                                Place Stake
                            </Button>
                        </Card>
                        <Card
                            margin="m-0">
                            <div className="flex flex-col gap-5 ">
                                <div className="grid grid-cols-2 place-items-center ">
                                    <div className=" font-teamdao text-4xl tracking-widest font-bold ">12</div>
                                    <div className=" font-teamdao text-4xl tracking-widest font-bold ">4</div>
                                </div>
                                <div className="grid grid-cols-3 place-items-center">
                                    <div className="flex items-center justify-center flex-col gap-1">
                                        <div className=" font-teamdao text-xl tracking-widest font-semibold ">1231</div>
                                        <div className="text-teamdao-primary">$ALGO</div>
                                    </div>
                                    <div className="text-teamdao-primary">STAKED</div>
                                    <div className="flex items-center justify-center flex-col gap-1">
                                        <div className=" font-teamdao text-xl tracking-widest font-semibold ">1231</div>
                                        <div className="text-teamdao-primary">$ALGO</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 place-items-center">
                                    <div className="flex items-center justify-center flex-col gap-1">
                                        <div className=" font-teamdao text-xl tracking-widest font-semibold ">1231</div>
                                    </div>
                                    <div className="text-teamdao-primary">STAKERS</div>
                                    <div className="flex items-center justify-center flex-col gap-1">
                                        <div className=" font-teamdao text-xl tracking-widest font-semibold ">1231</div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-2 h-96 lg:h-[90vh] lg:flex-[70%]">
                    <Player src="https://www.youtube.com/watch?v=YXohK05DnrI" />
                </div>
            </div>
        </Page >
    )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { query } = ctx
    await dbConnect()
    const MATCH = await match.findOne({ id: { $eq: query['id'] } }, { _id: 0, profit: 0, createdBy: 0 })
    return MATCH ? { props: { data: JSON.stringify(MATCH) } } : { props: {}, redirect: { destination: "/matches/404" } }
}