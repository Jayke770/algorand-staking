import { Navbar, Page, Link, Card, Button, List, ListItem } from "konsta/react"
import Head from "next/head"
import NextLink from 'next/link'
import { MdArrowBack } from "react-icons/md"
import { Logo, Player } from "../../components"
import { MdAdd, MdRemove, MdSend } from 'react-icons/md'
import { FaPaperPlane } from 'react-icons/fa'
export default function Match() {
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
                                        <span className="text-center font-teamdao tracking-widest text-2xl font-bold text-white">TEAM</span>
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
                        <Card
                            margin="m-0">
                            <div className="grid grid-cols-3">
                                <Button
                                    className="w-auto k-color-brand-teamdao-red">
                                    <MdRemove
                                        size={'1.5rem'} />
                                </Button>
                                <div className="font-semibold text-lg flex justify-center items-center">
                                    1 TEAM
                                </div>
                                <Button
                                    className="w-auto k-color-brand-teamdao-primary">
                                    <MdAdd size={'1.5rem'} />
                                </Button>
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
//<div className="relative flex-[35%]">
//                         <div className="chats flex flex-col gap-2 h-[calc(100%-75px)] overflow-auto">
//                             <div className="flex flex-col w-full">
//                                 <div className="flex flex-col gap-1 bg-md-dark-surface-1 rounded-b-lg rounded-tr-lg text-sm text-zinc-300 p-2">
//                                     <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis cumque illo autem praesentium quasi voluptates delectus pariatur suscipit eius distinctio placeat sunt, ullam repellat blanditiis tenetur, dolores veritatis neque incidunt!</div>
//                                     <div className="flex gap-1 items-center">
//                                         <img
//                                             src={"https://stake.teamdao.app/logo.png"}
//                                             className="h-5 w-5 object-cover"
//                                             alt="user" />
//                                         <div className="text-xs">@JHON DOE</div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="flex flex-col w-full">
//                                 <div className="flex flex-col max-w-[80%] gap-1 bg-md-dark-surface-1 rounded-b-lg rounded-tr-lg text-sm text-zinc-300 p-2">
//                                     <div>Lorus distinctio placeeritatis neque incidunt!</div>
//                                     <div className="flex gap-1 items-center">
//                                         <img
//                                             src={"https://stake.teamdao.app/logo.png"}
//                                             className="h-5 w-5 object-cover"
//                                             alt="user" />
//                                         <div className="text-xs">@JHON DOE</div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="flex flex-col items-end w-full">
//                                 <div className="flex flex-col gap-1 max-w-[80%] bg-slate-700 rounded-b-lg rounded-tl-lg text-sm text-zinc-300 p-2">
//                                     <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis cumque illo autem praesentium quasi voluptates delectus pariatur suscipit eius distinctio placeat sunt, ullam repellat blanditiis tenetur, dolores veritatis neque incidunt!</div>
//                                     <div className="flex gap-1 items-center">
//                                         <img
//                                             src={"https://stake.teamdao.app/logo.png"}
//                                             className="h-5 w-5 object-cover"
//                                             alt="user" />
//                                         <div className="text-xs">@JHON DOE</div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="flex flex-col items-end w-full">
//                                 <div className="flex flex-col gap-1 max-w-[80%] bg-slate-700 rounded-b-lg rounded-tl-lg text-sm text-zinc-300 p-2">
//                                     <div>Lfficiis lectus pariatu</div>
//                                     <div className="flex gap-1 items-center">
//                                         <img
//                                             src={"https://stake.teamdao.app/logo.png"}
//                                             className="h-5 w-5 object-cover"
//                                             alt="user" />
//                                         <div className="text-xs">@JHON DOE</div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="flex flex-col w-full">
//                                 <div className="flex flex-col max-w-[80%] gap-1 bg-md-dark-surface-1 rounded-b-lg rounded-tr-lg text-sm text-zinc-300 p-2">
//                                     <div>Lorus distinctio placeeritatis neque incidunt!</div>
//                                     <div className="flex gap-1 items-center">
//                                         <img
//                                             src={"https://stake.teamdao.app/logo.png"}
//                                             className="h-5 w-5 object-cover"
//                                             alt="user" />
//                                         <div className="text-xs">@JHON DOE</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="absolute bottom-0 w-full">
//                             <div className="relative">
//                                 <textarea
//                                     className="w-full outline-none pr-12 text-zinc-300 transition-all focus:ring-teamdao-primary focus:ring-1 focus:ring-offset-1 focus:ring-offset-zinc-800 py-2 px-3 rounded-lg bg-zinc-800"
//                                     placeholder="Message" />
//                                 <div className="absolute -top-1 right-4 h-full flex justify-center items-center">
//                                     <FaPaperPlane
//                                         className=" cursor-pointer"
//                                         size={'1.5rem'} />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>