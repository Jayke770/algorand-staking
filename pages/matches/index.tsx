import { Navbar, Link, Page, Tabbar, TabbarLink, Card, Segmented, SegmentedButton } from "konsta/react"
import NextLink from 'next/link'
import { MdArrowBack, MdExpandMore } from 'react-icons/md'
import { useEffect, useState } from 'react'
import { Logo } from "../../components"
import Head from "next/head"
import { ClientMatches, ClientMathTypes, wsClient } from '../../lib/client'
import { useContext } from 'react'
import { MatchCard, MatchEmpty, MatchLoader } from "../../components/client"
type Match = {
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
interface Tab {
    active: 'yesterday' | 'today' | 'tomorrow',
    data: {
        today: Match[],
        yesterday: Match[],
        tomorrow: Match[]
    }
}
export default function Matches() {
    const socket = useContext(wsClient)
    const { typesData, typesLoading } = ClientMathTypes()
    const { matchesData, matchesLoading } = ClientMatches()
    const [tab, setTab] = useState<Tab>({ active: 'today', data: { yesterday: [], today: [], tomorrow: [] } })
    useEffect(() => {
        if (matchesData) setTab({ active: tab.active, data: { today: matchesData.today, yesterday: matchesData.yesterday, tomorrow: matchesData.tomorrow } })
    }, [matchesData, setTab])
    return (
        <Page>
            <Head>
                <title>Matches</title>
            </Head>
            <Navbar
                colors={{
                    textMaterial: 'text-teamdao-primary'
                }}
                title="Matches"
                left={
                    <NextLink href={"/"} className="h-full flex justify-center items-center">
                        <Link
                            navbar
                            component="div"
                            className=" k-color-brand-teamdao-primary">
                            <MdArrowBack
                                className="text-teamdao-primary"
                                size={'1.75rem'} />
                        </Link>
                    </NextLink>
                }
                right={
                    <Link
                        component="div"
                        className="k-color-brand-teamdao-primary"
                        navbar>
                        <div className="flex items-center gap-2">
                            FIFA
                            <MdExpandMore
                                size={'1.25rem'} />
                        </div>
                    </Link>
                } />

            <div className="flex flex-col">
                <div className="col-span-full animate__animated animate__fadeInRight ms-300 fixed md:static bottom-0 left-0 right-0 w-full md:w-96 transition-all z-30 p-2.5">
                    <Segmented
                        strong
                        raised
                        colors={{
                            strongBgMaterial: "bg-md-light-surface-variant dark:bg-md-dark-surface-2"
                        }}>
                        <SegmentedButton
                            strong
                            onClick={() => setTab({ ...tab, active: "yesterday" })}
                            active={tab.active === "yesterday"}
                            className={`${tab.active === "yesterday" && "bg-white text-black"}`}>Yesterday</SegmentedButton>
                        <SegmentedButton
                            strong
                            onClick={() => setTab({ ...tab, active: "today" })}
                            active={tab.active === "today"}
                            className={`${tab.active === "today" && "bg-white text-black"}`}>Today</SegmentedButton>
                        <SegmentedButton
                            strong
                            onClick={() => setTab({ ...tab, active: "tomorrow" })}
                            active={tab.active === "tomorrow"}
                            className={`${tab.active === "tomorrow" && "bg-white text-black"}`}>Tomorrow</SegmentedButton>
                    </Segmented>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[calc(100vh-125px)] overflow-auto md:max-h-full p-2.5">
                    {/* yesterday */}
                    {tab.active === "yesterday" && (
                        matchesLoading ? <MatchLoader /> : (
                            tab.data?.yesterday?.length > 0 ? (
                                tab.data.yesterday.map((x, i) => <MatchCard key={x.id} index={i} isNormalMatch={x.teams.length === 2} match={x} />)
                            ) : <MatchEmpty />
                        )
                    )}
                    {/* yesterday */}
                    {tab.active === "today" && (
                        matchesLoading ? <MatchLoader /> : (
                            tab.data?.today?.length > 0 ? (
                                tab.data.today.map((x, i) => <MatchCard key={x.id} index={i} isNormalMatch={x.teams.length === 2} match={x} />)
                            ) : <MatchEmpty />
                        )
                    )}
                    {/* yesterday */}
                    {tab.active === "tomorrow" && (
                        matchesLoading ? <MatchLoader /> : (
                            tab.data?.tomorrow?.length > 0 ? (
                                tab.data.tomorrow.map((x, i) => <MatchCard key={x.id} index={i} isNormalMatch={x.teams.length === 2} match={x} />)
                            ) : <MatchEmpty />
                        )
                    )}
                </div>
            </div>
        </Page >
    )
}