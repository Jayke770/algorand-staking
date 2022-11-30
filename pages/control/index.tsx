import { Card, Chip, Link, List, ListItem, Navbar, Page, Panel } from "konsta/react"
import { HiBars3BottomRight } from 'react-icons/hi2'
import { FaUsers } from 'react-icons/fa'
import NextLink from 'next/link'
import { GiGamepad } from 'react-icons/gi'
import { SiTeamspeak } from 'react-icons/si'
import Head from "next/head"
import { getSession, signOut } from 'next-auth/react'
import type { GetServerSideProps } from 'next'
import { useState } from "react"
import { FaUserFriends, FaSignOutAlt, FaLayerGroup } from 'react-icons/fa'
export default function Control() {
    const [menu, setmenu] = useState(false)
    return (
        <Page>
            <Head>
                <title>$ALGO Staking</title>
            </Head>
            <Navbar
                colors={{
                    textMaterial: 'text-md-light-on-surface dark:text-teamdao-primary'
                }}
                title="$ALGO Staking"
                right={
                    <Link
                        onClick={(e) => setmenu(true)}
                        className=" k-color-brand-teamdao-primary"
                        navbar>
                        <HiBars3BottomRight size={'1.75rem'} />
                    </Link>
                } />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 py-3 px-2">
                <NextLink href="/control/wallet">
                    <Card
                        className=" k-color-brand-teamdao-fuchsia h-[156px] "
                        margin="m-0">
                        <div className="flex flex-col gap-2">
                            <div className=" text-xl">Wallet Balance</div>
                            <div className="flex gap-5">
                                <div className="px-3 py-0.5">
                                    <img
                                        alt="algorand"
                                        className=" w-20 h-20"
                                        src="/assets/logos/algorand.png" />
                                </div>
                                <div className="flex justify-center items-center gap-2">
                                    <div className=" text-teamdao-primary text-5xl font-teamdao tracking-widest">163</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </NextLink>
                <NextLink href="/control/users">
                    <Card
                        className="h-[156px] k-color-brand-teamdao-blue"
                        margin="m-0">
                        <div className="flex flex-col gap-2">
                            <div className=" text-xl">Users</div>
                            <div className="flex gap-5">
                                <div className="px-3">
                                    <FaUsers
                                        className=" text-blue-600"
                                        size={"5rem"} />
                                </div>
                                <div className="flex flex-col justify-center gap-2">
                                    <div className=" text-teamdao-primary text-5xl font-teamdao tracking-widest">163</div>
                                    <Chip>@jhon doe</Chip>
                                </div>
                            </div>
                        </div>
                    </Card>
                </NextLink>
                <NextLink href="/control/matches">
                    <Card
                        className=" k-color-brand-teamdao-amber h-[156px]"
                        margin="m-0">
                        <div className="flex flex-col gap-2">
                            <div className=" text-xl">Matches</div>
                            <div className="flex gap-5">
                                <div className="px-3">
                                    <GiGamepad
                                        className=" text-amber-600"
                                        size={"5rem"} />
                                </div>
                                <div className="flex flex-col justify-center gap-2">
                                    <div className=" text-teamdao-primary text-5xl font-teamdao tracking-widest">163</div>
                                    <Chip>MLBB</Chip>
                                </div>
                            </div>
                        </div>
                    </Card>
                </NextLink>
                <NextLink href="/control/teams">
                    <Card
                        className=" k-color-brand-teamdao-teal h-[156px]"
                        margin="m-0">
                        <div className="flex flex-col gap-2">
                            <div className=" text-xl">Teams</div>
                            <div className="flex gap-5">
                                <div className="px-3">
                                    <SiTeamspeak
                                        className=" text-teal-600"
                                        size={"5rem"} />
                                </div>
                                <div className="flex flex-col justify-center gap-2">
                                    <div className=" text-teamdao-primary text-5xl font-teamdao tracking-widest">163</div>
                                    <Chip>MLBB</Chip>
                                </div>
                            </div>
                        </div>
                    </Card>
                </NextLink>
                <NextLink href="/control/match-types">
                    <Card
                        className=" k-color-brand-teamdao-pink h-[156px]"
                        margin="m-0">
                        <div className="flex flex-col gap-2">
                            <div className=" text-xl">Match Types</div>
                            <div className="flex gap-5">
                                <div className="px-3">
                                    <FaLayerGroup
                                        className=" text-pink-600/50"
                                        size={"5rem"} />
                                </div>
                                <div className="flex flex-col justify-center gap-2">
                                    <div className=" text-teamdao-primary text-5xl font-teamdao tracking-widest">163</div>
                                    <Chip>MLBB</Chip>
                                </div>
                            </div>
                        </div>
                    </Card>
                </NextLink>
            </div>
            <Panel
                opened={menu}
                side="right"
                onBackdropClick={() => setmenu(false)}>
                <Page>
                    <Navbar
                        colors={{
                            textMaterial: 'text-md-light-on-surface dark:text-teamdao-primary'
                        }}
                        title="Menu" />
                    <List margin="m-0" strong outline>
                        <ListItem
                            media={
                                <FaUserFriends
                                    className="text-blue-500"
                                    size={'1.3rem'} />
                            }
                            title="Accounts"
                            link />
                        <ListItem
                            onClick={() => signOut()}
                            media={
                                <FaSignOutAlt
                                    className="text-red-500"
                                    size={'1.3rem'} />
                            }
                            title="Sign Out"
                            link />
                    </List>
                </Page>
            </Panel>
        </Page>
    )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const USER = await getSession(ctx)
    return USER ? { props: {} } : { props: {}, redirect: { destination: '/api/auth/signin' } }
}