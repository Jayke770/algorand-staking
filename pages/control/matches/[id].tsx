import { Button, Card, Checkbox, List, ListGroup, ListItem, Navbar, NavbarBackLink, Page, Segmented, SegmentedButton } from "konsta/react"
import { GetServerSideProps } from "next"
import { dbConnect, match } from "../../../models"
import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Head from "next/head"
import { useRouter } from "next/router"
import { Logo, Player, SmallLogo } from "../../../components"
import CountUp from "react-countup"
const border = {
    blue: "drop-shadow-[rgb(59_130_246)_0px_0px_8px]",
    pink: "drop-shadow-[rgb(236_72_153)_0px_0px_8px]"
}
interface UpdateInfo {
    score?: {
        id: string,
        score: number
    },
    tools?: 'tools' | 'declare'
}
export default function MatchInfo({ DATA }: { DATA: any }) {
    const router = useRouter()
    const [matchData, setmatchData] = useState<Match>(JSON.parse(DATA))
    const [tab, setTab] = useState<'info' | 'stakers'>('info')
    const [tools, setTools] = useState<'tools' | 'declare'>('tools')
    const [updateInfo, setupdateInfo] = useState<UpdateInfo>()
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
                        <div className="flex-[25%] flex flex-col gap-3 pb-20">
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
                                                    <span className=" font-teamdao text-zinc-300 text-3xl tracking-wide font-medium ">{matchData.teams[0].score}</span>
                                                </div>
                                                <div className="flex justify-center items-center text-zinc-500 text-3xl font-bold">-</div>
                                                <div className="flex justify-center items-center">
                                                    <span className=" font-teamdao text-zinc-300 text-3xl tracking-wide font-medium ">{matchData.teams[1].score}</span>
                                                </div>
                                                {/* staked */}
                                                <div className="flex justify-center items-center">
                                                    <CountUp
                                                        className=" font-teamdao text-zinc-300 text-xl tracking-wide font-medium"
                                                        start={0}
                                                        //@ts-ignore
                                                        end={matchData.bettors.reduce(x => x.teamid === matchData.teams[0].id ? x.amount : 0, 0)} />
                                                </div>
                                                <div className="flex justify-center items-center text-teamdao-primary text-lg">Staked</div>
                                                <div className="flex justify-center items-center">
                                                    <CountUp
                                                        className=" font-teamdao text-zinc-300 text-xl tracking-wide font-medium"
                                                        start={0}
                                                        //@ts-ignore
                                                        end={matchData.bettors.reduce(x => x.teamid === matchData.teams[1].id ? x.amount : 0, 0)} />
                                                </div>
                                                {/* stakers */}
                                                <div className="flex justify-center items-center">
                                                    <CountUp
                                                        className=" font-teamdao text-zinc-300 text-xl tracking-wide font-medium"
                                                        start={0}
                                                        //@ts-ignore
                                                        end={matchData.bettors.reduce(x => x.teamid === matchData.teams[0].id ? 1 : 0, 0)} />
                                                </div>
                                                <div className="flex justify-center items-center text-teamdao-primary text-lg">Stakers</div>
                                                <div className="flex justify-center items-center">
                                                    <CountUp
                                                        className=" font-teamdao text-zinc-300 text-xl tracking-wide font-medium"
                                                        start={0}
                                                        //@ts-ignore
                                                        end={matchData.bettors.reduce(x => x.teamid === matchData.teams[1].id ? 1 : 0, 0)} />
                                                </div>
                                            </div>
                                        </div>
                                    ) : 'fa'}
                                </Card>
                            </div>
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
                                                        after={
                                                            <Checkbox />
                                                        } />
                                                    <ListItem
                                                        link
                                                        chevron={false}
                                                        title={matchData.teams[1].name}
                                                        after={
                                                            <Checkbox />
                                                        } />
                                                    <div className="mx-3 mt-4">
                                                        <Button
                                                            className=" k-color-brand-teamdao-primary">Update Score</Button>
                                                    </div>
                                                </ListGroup>
                                            </List>
                                        ) : null
                                    ) : null}
                                </Card>
                            </div>
                        </div>
                        <div className="flex-[75%] w-full h-96 lg:h-[550px]">
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
    return { props: {} }
}