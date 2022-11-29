import { Navbar, Link, Page, Tabbar, TabbarLink, Card } from "konsta/react"
import NextLink from 'next/link'
import { MdArrowBack, MdExpandMore } from 'react-icons/md'
import { useState } from 'react'
import { Logo } from "../../components"
import Head from "next/head"
interface Tab {
    active?: 'yesterday' | 'today' | 'tomorrow',
    data?: any[]
}
export default function Matches() {
    const [tab, SetTab] = useState<Tab>({
        active: 'today',
        data: []
    })
    return (
        <Page>
            <Head>
                <title>Matches</title>
            </Head>
            <Navbar
                medium
                colors={{
                    textMaterial: 'text-teamdao-primary'
                }}
                title="Matches"
                left={
                    <NextLink href={"/"}>
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2.5 p-2.5">
                {Array.from({ length: 20 }).map((_, i) => (
                    <NextLink key={i} href={'/matches/1'}>
                        <Card
                            className={`cursor-pointer border-t border-l rounded-lg ${i % 2 === 0 ? 'border-red-600' : 'border-blue-600'} `}
                            margin="m-0"
                            contentWrapPadding="p-2">
                            <div className="grid grid-cols-8 gap-2 ">
                                <div className="col-span-4 grid grid-cols-3 w-full">
                                    <Logo
                                        className="w-full h-full drop-shadow-[rgb(59_130_246)_0px_0px_8px]"
                                        src="https://raw.githubusercontent.com/Jayke770/teamdao-staking-icons/master/teamdao_mlbb/INDIA8.png"
                                        size="w-full h-18"
                                        padding={'p-2'}
                                        onClick={() => console.log('fas')} />
                                    <div className="flex flex-col justify-center items-center">
                                        <span className="font-bold text-2xl tracking-wider text-white">VS</span>
                                        <span className="text-red-500 text-sm">Closed</span>
                                    </div>
                                    <Logo
                                        className="w-full h-full drop-shadow-[rgb(236_72_153)_0px_0px_8px]"
                                        src="https://raw.githubusercontent.com/Jayke770/teamdao-staking-icons/master/teamdao_mlbb/JULIET1.png"
                                        size="w-full h-18"
                                        padding={'p-2'}
                                        onClick={() => console.log('fas')} />
                                    <div className="col-span-full mt-2 grid grid-cols-3">
                                        <div className="flex justify-center items-center gap-1">
                                            <span>1 = </span>
                                            <span className="text-teamdao-primary">31</span>
                                        </div>
                                        <div />
                                        <div className="flex justify-center items-center gap-1">
                                            <span>1 = </span>
                                            <span className="text-red-500">31</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-4 flex justify-center h-full w-full flex-col flex-[20%] px-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Game:</span>
                                        <span className="text-teamdao-primary text-sm">FIFA</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Prize Pool:</span>
                                        <span className="text-teamdao-primary text-sm">FIFA</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Staring in:</span>
                                        <span className="text-red-500 text-sm">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </NextLink>
                ))}
            </div>
        </Page>
    )
}