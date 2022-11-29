import { Card, Chip, Link, Navbar, Page } from "konsta/react"
import { HiBars3BottomRight } from 'react-icons/hi2'
import { FaUsers } from 'react-icons/fa'
import NextLink from 'next/link'
import { GiGamepad } from 'react-icons/gi'
import { SiTeamspeak } from 'react-icons/si'
import Head from "next/head"
export default function Control() {
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
                        className=" k-color-brand-teamdao-primary"
                        navbar>
                        <HiBars3BottomRight size={'1.75rem'} />
                    </Link>
                } />
            <div className="flex flex-col gap-2 py-3 px-2">
                <NextLink href="/control/users">
                    <Card
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
                <NextLink href="/control/users">
                    <Card
                        className=" k-color-brand-teamdao-amber"
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
                <NextLink href="/control/users">
                    <Card
                        className=" k-color-brand-teamdao-teal"
                        margin="m-0">
                        <div className="flex flex-col gap-2">
                            <div className=" text-xl">Matches</div>
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
            </div>
        </Page>
    )
}