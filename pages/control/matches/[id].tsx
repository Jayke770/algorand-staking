import { Button, Card, Checkbox, List, ListGroup, ListItem, Navbar, NavbarBackLink, Page, Segmented, SegmentedButton } from "konsta/react"
import { GetServerSideProps } from "next"
import { dbConnect, match } from "../../../models"
import { getSession, useSession } from 'next-auth/react'
import { useContext, useEffect, useState } from 'react'
import Head from "next/head"
import { useRouter } from "next/router"
import { Logo, Player, SmallLogo } from "../../../components"
import { FaPlus, FaMinus } from 'react-icons/fa'
import CountUp from "react-countup"
import { Swal } from '../../../lib'
import { ws } from "../../../lib/control"
const border = {
    blue: "drop-shadow-[rgb(59_130_246)_0px_0px_8px]",
    pink: "drop-shadow-[rgb(236_72_153)_0px_0px_8px]"
}
interface UpdateInfo {
    score: {
        id?: string,
        defaultScore: number,
        score: number
    },
    tools: 'tools' | 'declare',
}
type Response = {
    status: boolean,
    title?: string,
    message?: string
}
export default function MatchInfo({ DATA }: { DATA: any }) {
    const router = useRouter()
    const socket = useContext(ws)
    const { data } = useSession()
    const [matchData, setmatchData] = useState<Match>(JSON.parse(DATA))
    const [tab, setTab] = useState<'info' | 'stakers'>('info')
    const [tools, setTools] = useState<'tools' | 'declare'>('tools')
    const [updateInfo, setupdateInfo] = useState<UpdateInfo>({
        score: {
            id: '',
            defaultScore: 0,
            score: 0
        },
        tools: 'tools'
    })
    const _addScore = (): void => {
        const SCORE = updateInfo.score.score + 1
        setupdateInfo({ ...updateInfo, score: { ...updateInfo.score, score: SCORE } })
    }
    const _minusScore = (): void => {
        const SCORE = updateInfo.score.score - 1
        if (SCORE < updateInfo.score.defaultScore) {
            setupdateInfo({ ...updateInfo, score: { ...updateInfo.score, score: updateInfo.score.defaultScore } })
        } else {
            setupdateInfo({ ...updateInfo, score: { ...updateInfo.score, score: SCORE } })
        }
    }
    const _updateScore = (): void => {
        Swal.fire({
            icon: 'question',
            titleText: 'Update Score',
            text: "Are you sure you want to update the score?",
            backdrop: true,
            allowOutsideClick: false,
            showDenyButton: true,
            confirmButtonText: "Update Score",
            reverseButtons: true,
            denyButtonText: 'Cancel'
        }).then((a) => {
            if (a.isConfirmed) {
                Swal.fire({
                    icon: 'info',
                    titleText: 'Updating Score',
                    text: "Please wait...",
                    backdrop: true,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    willOpen: async (): Promise<void> => {
                        Swal.showLoading(Swal.getConfirmButton())
                        try {
                            await fetch("/api/control/matches/score", {
                                method: 'post',
                                headers: {
                                    'content-type': 'application/json'
                                },
                                body: JSON.stringify({
                                    matchid: matchData.id,
                                    teamid: updateInfo.score.id,
                                    score: updateInfo.score.score
                                })
                            }).then(async (req): Promise<void> => {
                                if (req.ok) {
                                    const res: Response = await req.json()
                                    Swal.fire({
                                        icon: res.status ? 'success' : 'info',
                                        titleText: res.title,
                                        text: res.message,
                                        backdrop: true,
                                        allowOutsideClick: false
                                    }).then(() => {
                                        if (res.status) {
                                            setupdateInfo({ ...updateInfo, score: { ...updateInfo.score, id: '', score: 0, defaultScore: 0 } })
                                        }
                                    })
                                } else {
                                    throw new Error(`${req.status} ${req.statusText}`)
                                }
                            }).catch((e) => {
                                throw new Error(e.message)
                            })
                        } catch (e: any) {
                            Swal.fire({
                                icon: 'error',
                                titleText: "Connection error",
                                text: e.message,
                                backdrop: true,
                                allowOutsideClick: false
                            })
                        }
                    }
                })
            }
        })
    }
    const _declare = (type: 'beta-exec' | 'beta-admin' | 'draw'): void => {
        const teamid = matchData.teams[0].score > matchData.teams[1].score ? matchData.teams[0].id : matchData.teams[1].id
        Swal.fire({
            icon: 'question',
            titleText: type === 'draw' ? 'Draw Match' : 'Declare Match',
            text: type === 'draw' ? 'Are you sure you want to declare this match draw?' : 'Are you sure you want to declare this match?',
            backdrop: true,
            allowOutsideClick: false,
            showDenyButton: true,
            denyButtonText: 'Cancel',
            confirmButtonText: 'Declare Match',
            reverseButtons: true
        }).then((a) => {
            if (a.isConfirmed) {
                Swal.fire({
                    icon: 'info',
                    titleText: 'Declaring Match',
                    text: "Please wait...",
                    backdrop: true,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    willOpen: async (): Promise<void> => {
                        Swal.showLoading(Swal.getConfirmButton())
                        try {
                            await fetch("/api/control/matches/declare", {
                                method: 'post',
                                headers: {
                                    'content-type': 'application/json'
                                },
                                body: JSON.stringify({
                                    matchid: matchData.id,
                                    type: type,
                                    teamid
                                })
                            }).then(async (req): Promise<void> => {
                                if (req.ok) {
                                    const res: Response = await req.json()
                                    Swal.fire({
                                        icon: res.status ? 'success' : 'info',
                                        titleText: res.title,
                                        text: res.message,
                                        backdrop: true,
                                        allowOutsideClick: false,
                                    })
                                } else {
                                    throw new Error(`${req.status} ${req.statusText}`)
                                }
                            }).catch((e) => {
                                throw new Error(e.message)
                            })
                        } catch (e: any) {
                            Swal.fire({
                                icon: 'error',
                                titleText: 'Connection error',
                                text: e.message,
                                backdrop: true,
                                allowOutsideClick: false
                            })
                        }
                    }
                })
            }
        })
    }
    useEffect(() => {
        //join to match room 
        socket.emit("join-match-room", { id: matchData.id })
        return () => {
            socket.off("join-match-room")
        }
    }, [])
    return (
        <Page>
            <Head>
                <title>Match Info - {matchData.id}</title>
            </Head>
            <Navbar
                title="Match Info"
                left={
                    <NavbarBackLink onClick={() => router.push("/control/matches")} />
                }
                colors={{
                    textMaterial: 'text-md-light-on-surface dark:text-teamdao-primary'
                }} />
            <div className="flex flex-col p-3 gap-3">
                <div className="w-full md:w-96 mb-1">
                    <Segmented
                        strong
                        raised
                        className=" k-color-brand-teamdao-secondary">
                        <SegmentedButton
                            rounded
                            strong
                            active={tab === 'info'}
                            onClick={() => setTab('info')}>Information</SegmentedButton>
                        <SegmentedButton
                            rounded
                            strong
                            active={tab === 'stakers'}
                            onClick={() => setTab('stakers')}>Stakers</SegmentedButton>
                    </Segmented>
                </div>
                {/* Match info */}
                {tab === 'info' ? (
                    <div className="flex flex-col lg:flex-row gap-2 h-full">
                        <div className="flex-[25%] flex flex-col gap-3 lg:pb-20">
                            {/* Match Info */}
                            <div className="w-full h-full">
                                <Card
                                    className="w-full"
                                    margin="m-0">
                                    {matchData.teams.length <= 2 ? (
                                        <div className="p-4  flex flex-col">
                                            <div className="grid grid-cols-3">
                                                <Logo
                                                    className={`w-full h-full ${border.blue} text-teamdao-primary `}
                                                    src={matchData.teams[0].logo}
                                                    size="w-full xl:h-36 lg:h-30"
                                                    fill={"fill-md-dark-surface-1"} />
                                                <div className="flex justify-center items-center">
                                                    <p className="text-5xl dark:text-red-600 tracking-widest font-bold font-evil-empire">VS</p>
                                                </div>
                                                <Logo
                                                    className={`w-full h-full ${border.pink} text-teamdao-primary `}
                                                    src={matchData.teams[1].logo}
                                                    size="w-full xl:h-36 lg:h-30"
                                                    fill={"fill-md-dark-surface-1"} />
                                            </div>
                                            <div className="grid grid-cols-3 gap-y-5 mt-7">
                                                {/* team name */}
                                                <div className="flex justify-center items-center">
                                                    <span className=" font-teamdao text-teamdao-primary text-3xl tracking-wide font-medium ">{matchData.teams[0].name}</span>
                                                </div>
                                                <div className="flex justify-center items-center text-zinc-500 text-3xl font-bold">-</div>
                                                <div className="flex justify-center items-center">
                                                    <span className=" font-teamdao text-teamdao-primary text-3xl tracking-wide font-medium ">{matchData.teams[1].name}</span>
                                                </div>
                                                {/* teamsocre */}
                                                <div className="flex justify-center items-center">
                                                    <CountUp
                                                        start={0}
                                                        end={matchData.teams[0].score}
                                                        className=" font-teamdao text-zinc-300 text-3xl tracking-wide font-medium " />
                                                </div>
                                                <div className="flex justify-center items-center text-teamdao-primary text-lg">Score</div>
                                                <div className="flex justify-center items-center">
                                                    <CountUp
                                                        start={0}
                                                        end={matchData.teams[1].score}
                                                        className=" font-teamdao text-zinc-300 text-3xl tracking-wide font-medium " />
                                                </div>
                                                {/* staked */}
                                                <div className="flex justify-center items-center flex-col gap-2">
                                                    <CountUp
                                                        className=" font-teamdao text-zinc-300 text-xl tracking-wide font-medium"
                                                        start={0}
                                                        end={matchData.bettors.reduce((sum, x) => x.teamid === matchData.teams[0].id ? x.amount : 0, 0)} />
                                                    <span className="text-xs text-teamdao-primary">$ALGO</span>
                                                </div>
                                                <div className="flex justify-center items-center text-teamdao-primary text-lg">Staked</div>
                                                <div className="flex flex-col justify-center items-center gap-2">
                                                    <CountUp
                                                        className=" font-teamdao text-zinc-300 text-xl tracking-wide font-medium"
                                                        start={0}
                                                        end={matchData.bettors.reduce((sum, x) => x.teamid === matchData.teams[1].id ? x.amount : 0, 0)} />
                                                    <span className="text-xs text-teamdao-primary">$ALGO</span>
                                                </div>
                                                {/* stakers */}
                                                <div className="flex justify-center items-center">
                                                    <CountUp
                                                        className=" font-teamdao text-zinc-300 text-xl tracking-wide font-medium"
                                                        start={0}
                                                        end={matchData.bettors.reduce((sum, x) => x.teamid === matchData.teams[0].id ? 1 : 0, 0)} />
                                                </div>
                                                <div className="flex justify-center items-center text-teamdao-primary text-lg">Stakers</div>
                                                <div className="flex justify-center items-center">
                                                    <CountUp
                                                        className=" font-teamdao text-zinc-300 text-xl tracking-wide font-medium"
                                                        start={0}
                                                        end={matchData.bettors.reduce((sum, x) => x.teamid === matchData.teams[1].id ? 1 : 0, 0)} />
                                                </div>
                                            </div>
                                        </div>
                                    ) : 'fa'}
                                </Card>
                            </div>
                            {/* Match tools */}
                            {!matchData.isDone ? (
                                <div className="w-full h-full">
                                    <Card
                                        margin="m-0"
                                        className="w-full">
                                        <Segmented
                                            strong
                                            raised
                                            className=" k-color-brand-teamdao-secondary">
                                            <SegmentedButton
                                                rounded
                                                strong
                                                onClick={() => setTools('tools')}
                                                active={tools === 'tools'}>Tools</SegmentedButton>
                                            <SegmentedButton
                                                rounded
                                                strong
                                                onClick={() => setTools('declare')}
                                                active={tools === 'declare'}>Declare</SegmentedButton>
                                        </Segmented>
                                        {tools === 'tools' ? (
                                            //update score, etc
                                            matchData.teams.length <= 2 ? (
                                                <List margin="my-4">
                                                    <ListGroup>
                                                        <ListItem
                                                            colors={{
                                                                groupTitleBgMaterial: 'bg-md-light-surface-1 dark:bg-md-dark-surface-1'
                                                            }}
                                                            groupTitle
                                                            title="Select Team" />
                                                        <ListItem
                                                            link
                                                            chevron={false}
                                                            title={matchData.teams[0].name}
                                                            onClick={() => setupdateInfo({
                                                                ...updateInfo,
                                                                score: {
                                                                    ...updateInfo.score,
                                                                    defaultScore: matchData.teams[0].score,
                                                                    id: matchData.teams[0].id === updateInfo.score.id ? '' : matchData.teams[0].id
                                                                }
                                                            })}
                                                            after={
                                                                <Checkbox
                                                                    className=" k-color-brand-teamdao-primary"
                                                                    checked={updateInfo?.score?.id === matchData.teams[0].id}
                                                                    onChange={() => setupdateInfo({
                                                                        ...updateInfo,
                                                                        score: {
                                                                            ...updateInfo.score,
                                                                            defaultScore: matchData.teams[0].score,
                                                                            id: matchData.teams[0].id === updateInfo.score.id ? '' : matchData.teams[0].id
                                                                        }
                                                                    })} />
                                                            } />
                                                        <ListItem
                                                            link
                                                            chevron={false}
                                                            title={matchData.teams[1].name}
                                                            onClick={() => setupdateInfo({
                                                                ...updateInfo,
                                                                score: {
                                                                    ...updateInfo.score,
                                                                    defaultScore: matchData.teams[1].score,
                                                                    id: matchData.teams[1].id === updateInfo.score.id ? '' : matchData.teams[1].id
                                                                }
                                                            })}
                                                            after={
                                                                <Checkbox
                                                                    className=" k-color-brand-teamdao-primary"
                                                                    checked={updateInfo?.score?.id === matchData.teams[1].id}
                                                                    onChange={() => setupdateInfo({
                                                                        ...updateInfo,
                                                                        score: {
                                                                            ...updateInfo.score,
                                                                            defaultScore: matchData.teams[1].score,
                                                                            id: matchData.teams[1].id === updateInfo.score.id ? '' : matchData.teams[1].id
                                                                        }
                                                                    })} />
                                                            } />
                                                        <div className="flex justify-between items-center mx-3.5 mt-4">
                                                            <div className="flex justify-center items-center">
                                                                <span className="text-xl font-bold text-teamdao-primary" >
                                                                    {updateInfo?.score?.score ? updateInfo?.score?.score : 0}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-end items-center gap-1.5">
                                                                <Button
                                                                    small
                                                                    disabled={!(updateInfo.score.id)}
                                                                    onClick={_minusScore}
                                                                    className=" k-color-brand-teamdao-red">
                                                                    <FaMinus className=" text-base" />
                                                                </Button>
                                                                <Button
                                                                    small
                                                                    disabled={!(updateInfo.score.id)}
                                                                    onClick={_addScore}
                                                                    className=" k-color-brand-teamdao-primary">
                                                                    <FaPlus className=" text-base" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="mx-3 mt-4">
                                                            <Button
                                                                onClick={_updateScore}
                                                                disabled={!(updateInfo.score.id) || updateInfo.score.score === 0}
                                                                className=" k-color-brand-teamdao-primary">Update Score</Button>
                                                        </div>
                                                    </ListGroup>
                                                </List>
                                            ) : null
                                        ) : (
                                            //declare winner
                                            matchData.teams.length <= 2 ? (
                                                <List margin="my-4">
                                                    <ListGroup>
                                                        <ListItem
                                                            colors={{
                                                                groupTitleBgMaterial: 'bg-md-light-surface-1 dark:bg-md-dark-surface-1'
                                                            }}
                                                            groupTitle
                                                            title="Select Team" />
                                                        <ListItem
                                                            title={matchData.teams[0].name}
                                                            link
                                                            chevron={false}
                                                            after={
                                                                <Checkbox
                                                                    readOnly
                                                                    checked={matchData.teams[0].score > matchData.teams[1].score}
                                                                    className=" k-color-brand-teamdao-primary" />
                                                            } />
                                                        <ListItem
                                                            title={matchData.teams[1].name}
                                                            link
                                                            chevron={false}
                                                            after={
                                                                <Checkbox
                                                                    readOnly
                                                                    checked={matchData.teams[1].score > matchData.teams[0].score}
                                                                    className=" k-color-brand-teamdao-primary" />
                                                            } />
                                                    </ListGroup>
                                                    <div className="mx-3 grid grid-cols-2 gap-2 mt-5">
                                                        <Button
                                                            onClick={() => _declare('beta-exec')}
                                                            disabled={(matchData.declare?.initial && !matchData.declare?.final) || matchData.teams[0].score === matchData.teams[1].score}
                                                            className=" k-color-brand-teamdao-blue">Beta Executive</Button>
                                                        <Button
                                                            onClick={() => _declare('beta-admin')}
                                                            disabled={(!matchData.declare?.initial && !matchData.declare?.final) || matchData.teams[0].score === matchData.teams[1].score}
                                                            className=" k-color-brand-teamdao-amber">Beta Administrator</Button>
                                                        <Button
                                                            onClick={() => _declare('draw')}
                                                            disabled={data?.user?.name !== 'admin'}
                                                            className="col-span-full k-color-brand-teamdao-primary">Draw Match</Button>
                                                    </div>
                                                </List>
                                            ) : 'FASF'
                                        )}
                                    </Card>
                                </div>
                            ) : null}
                        </div>
                        <div className="flex-[75%] w-full h-[500px] lg:h-[550px]">
                            <Player src="https://www.youtube.com/watch?v=YXohK05DnrI" />
                        </div>
                    </div>
                ) : null}
            </div>
        </Page>
    )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const USER = await getSession(ctx)
    if (USER) {
        await dbConnect()
        const MATCH = await match.findOne({ id: { $eq: ctx.query['id'] } })
        return {
            props: {
                DATA: JSON.stringify(MATCH)
            }
        }
    } else {
        return {
            props: {},
            redirect: {
                destination: "404?info=match"
            }
        }
    }
}