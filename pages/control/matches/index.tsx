import { useContext, useEffect, useState } from "react"
import Head from "next/head"
import { Page, Navbar, NavbarBackLink, Fab, Segmented, SegmentedButton, Card } from 'konsta/react'
import { useRouter } from "next/router"
import { MdAdd } from 'react-icons/md'
import AvatarGroup from '@atlaskit/avatar-group'
import { faker } from '@faker-js/faker'
import CountUp from "react-countup"
import NextLink from 'next/link'
import { matches, ws } from "../../../lib/control"
import InfiniteScroll from 'react-infinite-scroller'
import { MatchCard, MatchLoader } from "../../../components/control"
interface Matches {
    default?: {
        _id?: string,
        __v: any,
        id: string,
        teams: { id: string, logo: string, name: string, score: number }[],
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
    }[],
    data?: {
        _id?: string,
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
        profit: number,
        shareLink: string,
        liveLink: string,
        createdBy: string,
        created: string,
    }[],
    searching?: boolean,
    more?: boolean
}
export default function Matches() {
    const router = useRouter()
    const socket = useContext(ws)
    const { matchesLoading, matchesData } = matches()
    const [Matches, setMatches] = useState<Matches>()
    const data = Array.from({ length: 10 }).map(() => {
        return {
            name: faker.name.fullName(),
            src: faker.image.avatar()
        }
    })
    useEffect(() => {
        if (matchesData) setMatches({ data: matchesData, default: matchesData, searching: false, more: true })
    }, [matchesData, setMatches])
    return (
        <Page>
            <Head>
                <title>Matches</title>
            </Head>
            <Navbar
                title="Matches"
                colors={{
                    textMaterial: 'text-md-light-on-surface dark:text-teamdao-primary'
                }}
                left={
                    <NavbarBackLink onClick={() => router.push("/control")} />
                } />
            <div className="flex flex-col p-3 gap-3">
                <div className="w-full md:w-96 mb-1">
                    <Segmented
                        strong
                        raised
                        className=" k-color-brand-teamdao-secondary">
                        <SegmentedButton rounded strong active>All</SegmentedButton>
                        <SegmentedButton>Ongoing</SegmentedButton>
                        <SegmentedButton>Ended</SegmentedButton>
                    </Segmented>
                </div>
                <div className="h-[calc(100vh-150px)] overflow-auto">
                    <InfiniteScroll
                        pageStart={0}
                        hasMore={true}
                        loadMore={() => console.log()}
                        useWindow={false}
                        className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {matchesLoading ? <MatchLoader /> : null}
                        {Matches?.data?.map((match) => <MatchCard key={match.id} match={match} isNormalMatch={match.teams.length === 2} />)}
                    </InfiniteScroll>
                </div>
                {/* {Array.from({ length: 20 }).map((_, i) => (
                    <Card
                        raised
                        key={i}
                        margin='m-0'>
                        <div className="grid grid-cols-3">
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <img
                                    src={"https://raw.githubusercontent.com/Jayke770/teamdao-staking-icons/master/codm/INDIA9.png"}
                                    alt=""
                                    className="w-18 h-18" />
                                <div className="">{faker.name.firstName()}</div>
                            </div>
                            <div className="flex gap-3 justify-center items-center">
                                <CountUp className="text-xl text-teamdao-primary" start={0} end={9} />
                                <div className="text-3xl font-bold tracking-wider text-red-600">VS</div>
                                <CountUp className="text-xl text-teamdao-primary" start={0} end={9} />
                            </div>
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <img
                                    src={"https://raw.githubusercontent.com/Jayke770/teamdao-staking-icons/master/codm/KILO17.png"}
                                    alt=""
                                    className="w-18 h-18" />
                                <div className="">{faker.name.firstName()}</div>
                            </div>
                        </div>
                    </Card>
                ))}
                {Array.from({ length: 20 }).map((_, i) => (
                    <Card
                        raised
                        key={i}
                        margin='m-0'>
                        <AvatarGroup size="large" appearance="stack" data={data} maxCount={6} />
                    </Card>
                ))} */}
            </div>
            <NextLink href={'/control/matches/create'} passHref>
                <Fab
                    component="div"
                    text="New Match"
                    icon={<MdAdd />}
                    className=" k-color-brand-teamdao-primary fixed bottom-3 right-3" />
            </NextLink>
        </Page>
    )
}