//@ts-nocheck
import { Navbar, Page, Link, Card, Button, List, ListItem, Preloader } from "konsta/react"
import Head from "next/head"
import NextLink from 'next/link'
import { MdArrowBack } from "react-icons/md"
import { Logo, NotifyConnectWallet, Player, Web3Account } from "../../components"
import { MdAdd, MdRemove, MdSend } from 'react-icons/md'
import { FaPaperPlane } from 'react-icons/fa'
import type { GetServerSideProps } from 'next'
import { dbConnect, match } from '../../models'
import { useContext, useEffect, useState } from "react"
import { wsClient } from '../../lib/client'
import { config, Swal, web3 } from '../../lib'
import Countdown from "react-countdown"
import { useConnectWallet, useWallet } from "@txnlab/use-wallet"
import moment from "moment"
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
        teamid: string,
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
    amount?: number,
    profit?: number,
    isAllInLoading: boolean,
    userStake?: {
        betId: string,
        address: string,
        userid: string,
        teamid: string,
        username: string
        amount: number,
        created: string,
    }
}
type Response = {
    status: boolean,
    title?: string,
    message?: string,
    footer?: string
}
const PERCENT_DEDUCTION = process.env.NEXT_PUBLIC_PERCENT_DEDUCTION
export default function Match({ data }: { data: any }) {
    const { reconnectProviders, disconnect } = useConnectWallet()
    const { activeAccount, getAccountInfo, signTransactions, sendTransactions } = useWallet()
    const socket = useContext(wsClient)
    const [matchData, setMatchData] = useState<Match>(JSON.parse(data))
    const [stake, setStake] = useState<Stake>({
        matchid: matchData.id,
        amount: 0,
        profit: 0,
        isAllInLoading: false
    })
    const _addStake = (): void => {
        let stakeValue = 0
        if (stake.amount <= 9) {
            stakeValue = stake.amount + 1
        } else if (stake.amount > 9 && stake.amount < 100) {
            stakeValue = stake.amount + 10
        } else if (stake.amount >= 100) {
            stakeValue = (stake.amount + 100) <= 1000 ? (stake.amount + 100) : 1000
        }
        const TOTAL_MATCH_STAKE = matchData.bettors.reduce((sum, bettor) => sum + bettor.amount, 0)
        //@ts-ignore
        const TOTAL_STAKE = config.percent(parseInt(PERCENT_DEDUCTION), TOTAL_MATCH_STAKE + stakeValue)
        const SELECTED_TEAM_TOTAL_STAKE = matchData.bettors.reduce((sum, bettor) => sum + (bettor.teamid === stake.teamid ? bettor.amount : 0), 0)
        const PROFIT_PERCENT = stakeValue / (stakeValue + SELECTED_TEAM_TOTAL_STAKE) * 100
        const PROFIT = ((PROFIT_PERCENT * TOTAL_STAKE) / 100) - stakeValue
        setStake({ ...stake, amount: stakeValue, profit: PROFIT })
    }
    const _minusStake = (): void => {
        let stakeValue = 0
        if (stake.amount > 0) {
            if (stake.amount <= 9) {
                stakeValue = stake.amount - 1
            } else if (stake.amount > 9 && stake.amount < 100) {
                stakeValue = stake.amount - 10
            } else if (stake.amount >= 100) {
                stakeValue = stake.amount - 100
            }
        }
        const TOTAL_MATCH_STAKE = matchData.bettors.reduce((sum, bettor) => sum + bettor.amount, 0)
        //@ts-ignore
        const TOTAL_STAKE = config.percent(parseInt(PERCENT_DEDUCTION), TOTAL_MATCH_STAKE + stakeValue)
        const SELECTED_TEAM_TOTAL_STAKE = matchData.bettors.reduce((sum, bettor) => sum + (bettor.teamid === stake.teamid ? bettor.amount : 0), 0)
        const PROFIT_PERCENT = stakeValue / (stakeValue + SELECTED_TEAM_TOTAL_STAKE) * 100
        const PROFIT = ((PROFIT_PERCENT * TOTAL_STAKE) / 100) - stakeValue
        setStake({ ...stake, amount: stakeValue, profit: PROFIT })
    }
    const _allIn = async (): Promise<void> => {
        if (activeAccount) {
            setStake({ ...stake, isAllInLoading: true })
            const ACCOUNT_INFO = await getAccountInfo()
            const stakeValue = web3.algosdk.microalgosToAlgos(ACCOUNT_INFO.amount)
            const TOTAL_MATCH_STAKE = matchData.bettors.reduce((sum, bettor) => sum + bettor.amount, 0)
            //@ts-ignore
            const TOTAL_STAKE = config.percent(parseInt(PERCENT_DEDUCTION), TOTAL_MATCH_STAKE + stakeValue)
            const SELECTED_TEAM_TOTAL_STAKE = matchData.bettors.reduce((sum, bettor) => sum + (bettor.teamid === stake.teamid ? bettor.amount : 0), 0)
            const PROFIT_PERCENT = stakeValue / (stakeValue + SELECTED_TEAM_TOTAL_STAKE) * 100
            const PROFIT = ((PROFIT_PERCENT * TOTAL_STAKE) / 100) - stakeValue
            setStake({ ...stake, amount: stakeValue, profit: PROFIT, isAllInLoading: false })
        }
    }
    const _match_countdown = ({ days, hours, minutes, seconds, completed }: { days: number, hours: number, minutes: number, seconds: number, completed: boolean }) => {
        if (completed) {
            return <span className='text-base text-center dark:text-red-500 font-bold'>STAKING IS CLOSED</span>
        } else {
            return <span className='text-base text-center dark:text-teamdao-primary font-bold uppercase'>{days}D {hours}:{minutes}:{seconds} Until Staking is closed</span>
        }
    }
    const _stake = (): void => {
        if (!stake.userStake && stake.amount && stake.teamid && activeAccount?.address && !moment(matchData.stakingStart).fromNow().includes("ago")) {
            Swal.fire({
                icon: 'question',
                titleText: "Place Stake",
                text: "Are you sure you want to place this stake?",
                backdrop: true,
                allowOutsideClick: false,
                showDenyButton: true,
                denyButtonText: 'Cancel',
                confirmButtonText: 'Yes',
                reverseButtons: true,
                showClass: {
                    popup: 'animate__animated animate__zoomIn ms-500'
                },
                hideClass: {
                    popup: 'animate__animated animate__zoomOut ms-500'
                }
            }).then((a) => {
                if (a.isConfirmed) {
                    Swal.fire({
                        icon: 'info',
                        titleText: 'Placing Stake',
                        text: "Pleace wait...",
                        backdrop: true,
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showClass: {
                            popup: 'animate__animated animate__zoomIn ms-500'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__zoomOut ms-500'
                        },
                        willOpen: async (): Promise<void> => {
                            Swal.showLoading(Swal.getConfirmButton())
                            const USER_ACCOUNT = await getAccountInfo()
                            const BALANCE = web3.algosdk.microalgosToAlgos(USER_ACCOUNT.amount)
                            if (BALANCE >= stake.amount) {
                                Swal.fire({
                                    icon: "info",
                                    titleText: "Confirm Transaction",
                                    text: `Please confirm the transaction on your ${activeAccount?.providerId} to stake.`,
                                    backdrop: true,
                                    allowOutsideClick: false,
                                    showConfirmButton: false,
                                    willOpen: async () => {
                                        Swal.showLoading(Swal.getConfirmButton())
                                        try {
                                            const PARAMS = await web3.algod.getTransactionParams().do()
                                            const TRANSACTION = web3.algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                                                from: activeAccount?.address,
                                                //@ts-ignore
                                                to: process.env.NEXT_PUBLIC_ALGO_ADDRESS,
                                                amount: web3.algosdk.algosToMicroalgos(stake.amount),
                                                note: new TextEncoder().encode(`Stake For Match ID: ${stake.matchid}`),
                                                suggestedParams: PARAMS
                                            })
                                            const ENCODED_TX = web3.algosdk.encodeUnsignedTransaction(TRANSACTION)
                                            const SIGNED_TX = await signTransactions([ENCODED_TX])
                                            await sendTransactions(SIGNED_TX).then(async (tx_res) => {
                                                Swal.fire({
                                                    icon: 'info',
                                                    titleText: 'Transaction Confirmed',
                                                    footer: "Don't close this tab to prevent stake loss.",
                                                    text: "Please wait while we process your stake",
                                                    showConfirmButton: false,
                                                    backdrop: true,
                                                    allowOutsideClick: false,
                                                    showClass: {
                                                        popup: 'animate__animated animate__zoomIn ms-500'
                                                    },
                                                    hideClass: {
                                                        popup: 'animate__animated animate__zoomOut ms-500'
                                                    },
                                                    willOpen: async () => {
                                                        Swal.showLoading(Swal.getConfirmButton())
                                                        await web3.algosdk.waitForConfirmation(web3.algod, TRANSACTION.txID(), 1)
                                                        await fetch("/api/client/matches/stake", {
                                                            method: "post",
                                                            headers: {
                                                                'content-type': 'application/json'
                                                            },
                                                            body: JSON.stringify({
                                                                txInfo: tx_res,
                                                                address: activeAccount?.address,
                                                                //@ts-ignore
                                                                amount: web3.algosdk.microalgosToAlgos(tx_res.txn.txn.amt),
                                                                teamid: stake.teamid,
                                                                matchid: stake.matchid
                                                            })
                                                        }).then(async (req) => {
                                                            if (req.ok) {
                                                                const res: Response = await req.json()
                                                                if (res.status) setStake({ matchid: matchData.id, amount: 0, profit: 0, isAllInLoading: false })
                                                                Swal.fire({
                                                                    icon: res.status ? 'success' : 'info',
                                                                    titleText: res.title,
                                                                    text: res.message,
                                                                    backdrop: true,
                                                                    footer: res.footer,
                                                                    allowOutsideClick: false,
                                                                    showClass: {
                                                                        popup: 'animate__animated animate__zoomIn ms-500'
                                                                    },
                                                                    hideClass: {
                                                                        popup: 'animate__animated animate__zoomOut ms-500'
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            })
                                        } catch (e: any) {
                                            Swal.fire({
                                                icon: 'error',
                                                titleText: 'Transaction failed',
                                                text: e.message,
                                                backdrop: true,
                                                allowOutsideClick: false,
                                                showClass: {
                                                    popup: 'animate__animated animate__zoomIn ms-500'
                                                },
                                                hideClass: {
                                                    popup: 'animate__animated animate__zoomOut ms-500'
                                                },
                                            })
                                        }
                                    }
                                })
                            } else {
                                Swal.fire({
                                    icon: 'warning',
                                    titleText: 'Oppss',
                                    text: "Your Balance is not enough to stake.",
                                    backdrop: true,
                                    allowOutsideClick: false,
                                    showClass: {
                                        popup: 'animate__animated animate__zoomIn ms-500'
                                    },
                                    hideClass: {
                                        popup: 'animate__animated animate__zoomOut ms-500'
                                    },
                                })
                            }
                        }
                    })
                }
            })
        }
    }
    const reconnect = () => reconnectProviders()
    //@ts-nocheck
    useEffect(() => {
        socket.emit("join-match-room", { id: matchData.id })
        //new match bettor 
        socket.on("match-bettor", (match) => setMatchData(match))
        return () => {
            socket.off("join-match-room")
            socket.off("match-bettor")
        }
    }, [])
    useEffect(() => {
        reconnect()
    }, [])
    //get user stake
    useEffect(() => {
        if (matchData && activeAccount?.address) {
            const stakeValue = stake.userStake?.amount
            const TOTAL_MATCH_STAKE = matchData.bettors.reduce((sum, bettor) => sum + bettor.amount, 0)
            const TOTAL_STAKE = config.percent(parseInt(PERCENT_DEDUCTION), TOTAL_MATCH_STAKE + stakeValue)
            const SELECTED_TEAM_TOTAL_STAKE = matchData.bettors.reduce((sum, bettor) => sum + (bettor.teamid === stake.teamid ? bettor.amount : 0), 0)
            const PROFIT_PERCENT = stakeValue / (stakeValue + SELECTED_TEAM_TOTAL_STAKE) * 100
            const PROFIT = ((PROFIT_PERCENT * TOTAL_STAKE) / 100) - stakeValue
            setStake({
                ...stake,
                teamid: stake.userStake?.teamid,
                amount: stake.userStake?.amount,
                profit: PROFIT,
                userStake: matchData.bettors.find(x => x.address === activeAccount?.address)
            })
        }
    }, [matchData, activeAccount?.address])
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
                    <NextLink href={"/matches"} className="h-full flex justify-center items-center">
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
                right={<Web3Account />} />
            <div className="flex flex-col lg:flex-row p-4 gap-3">
                <div className="flex lg:flex-[30%]">
                    <div className="flex w-full flex-col gap-2">
                        {/* stake logo */}
                        <Card
                            margin="m-0"
                            className="w-full">
                            {matchData.teams.length === 2 ? (
                                <div className="grid grid-cols-3 justify-center items-center gap-1 p-1">
                                    <div className="flex justify-center items-center">
                                        <Logo
                                            className={`w-full h-full ${stake.teamid === matchData.teams[0].id || stake.userStake?.teamid === matchData.teams[0].id ? "drop-shadow-[rgb(42_254_48)_0px_0px_8px]" : "drop-shadow-[rgb(59_130_246)_0px_0px_8px]"}  text-teamdao-primary `}
                                            src={matchData.teams[0].logo}
                                            size="w-full xl:h-36 lg:h-30"
                                            fill={stake.teamid === matchData.teams[0].id || stake.userStake?.teamid === matchData.teams[0].id ? "fill-teamdao-primary" : "fill-md-dark-surface-1"}
                                            padding={'md:p-3'}
                                            onClick={() => !moment(matchData.stakingStart).fromNow().includes("ago") && !stake.userStake ? setStake({ ...stake, teamid: stake.teamid === matchData.teams[0].id ? undefined : matchData.teams[0].id }) : null} />
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <p className="text-5xl dark:text-red-600 tracking-wider font-bold font-evil-empire">VS</p>
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <Logo
                                            className={`w-full h-full ${stake.teamid === matchData.teams[1].id || stake.userStake?.teamid === matchData.teams[1].id ? "drop-shadow-[rgb(42_254_48)_0px_0px_8px]" : "drop-shadow-[rgb(236_72_153)_0px_0px_8px]"}`}
                                            src={matchData.teams[1].logo}
                                            size="w-full xl:h-36 lg:h-30"
                                            fill={stake.teamid === matchData.teams[1].id || stake.userStake?.teamid === matchData.teams[1].id ? "fill-teamdao-primary" : "fill-md-dark-surface-1"}
                                            padding={'md:p-3'}
                                            onClick={() => !moment(matchData.stakingStart).fromNow().includes("ago") && !stake.userStake ? setStake({ ...stake, teamid: stake.teamid === matchData.teams[1].id ? undefined : matchData.teams[1].id }) : null} />
                                    </div>
                                </div>
                            ) : null}
                            <div className="flex flex-col mt-6 gap-3">
                                {matchData.teams.length === 2 ? (
                                    <div className="grid grid-cols-3">
                                        <div className="flex justify-center items-center">
                                            <span className="text-center font-teamdao tracking-widest text-2xl font-bold text-white">{matchData.teams[0].name}</span>
                                        </div>
                                        <div />
                                        <div className="flex justify-center items-center">
                                            <span className="text-center font-teamdao tracking-widest text-2xl font-bold text-white">{matchData.teams[1].name}</span>
                                        </div>
                                    </div>
                                ) : null}
                                {stake.teamid ? (
                                    <div className="flex flex-col gap-2 px-3">
                                        <div className="flex justify-between items-baseline">
                                            <span>Stake Amount:</span>
                                            <span className=" text-teamdao-primary">{stake.amount ? stake.amount.toFixed(2) : "0.00"} $ALGO</span>
                                        </div>
                                        <div className="flex justify-between items-baseline">
                                            <span>Est. Prize:</span>
                                            <span className=" text-teamdao-primary">{stake.amount ? stake.profit?.toFixed(2) : "0.00"} $ALGO</span>
                                        </div>
                                        <div className="flex justify-between items-baseline">
                                            <span>Est. Earnings (-1%):</span>
                                            <span className=" text-teamdao-primary">{stake.amount ? (stake.amount + stake.profit).toFixed(2) : "0.00"} $ALGO</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center mt-2">
                                        {matchData.isDone ? (
                                            <span className='text-base text-center dark:text-red-500 font-bold'>STAKING IS CLOSED</span>
                                        ) : (
                                            <Countdown
                                                date={matchData.stakingStart}
                                                renderer={_match_countdown} />
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                        {stake.teamid && !stake.userStake ? (
                            //stake card
                            <Card
                                className="animate__animated animate__fadeInLeft ms-300"
                                margin="m-0">
                                <div className="flex justify-between">
                                    <div className="font-semibold text-lg flex justify-center items-center">
                                        {stake.amount ? stake.amount.toFixed(2) : 0} $ALGO
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            onClick={_minusStake}
                                            small
                                            className="w-auto !px-2 k-color-brand-teamdao-red">
                                            <MdRemove
                                                size={'1.25rem'} />
                                        </Button>
                                        {stake.isAllInLoading ? (
                                            <div className="animate__animated animate__fadeInUp ms-300 flex justify-center items-center">
                                                <Preloader size="h-6 w-6" className=" k-color-brand-teamdao-primary" />
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={_allIn}
                                                small
                                                className="animate__animated animate__fadeInDown ms-300 w-auto !px-2 k-color-brand-teamdao-blue">
                                                ALL IN
                                            </Button>
                                        )}
                                        <Button
                                            onClick={_addStake}
                                            small
                                            className="w-auto !px-2 k-color-brand-teamdao-primary">
                                            <MdAdd size={'1.25rem'} />
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    onClick={_stake}
                                    disabled={!stake.amount || !stake.teamid}
                                    className="mt-3 k-color-brand-teamdao-primary !font-bold">
                                    Place Stake
                                </Button>
                            </Card>
                        ) : (
                            //match info
                            <Card
                                className="animate__animated animate__fadeInDown ms-300"
                                margin="m-0">
                                {matchData.teams.length === 2 ? (
                                    <div className="flex flex-col gap-5 ">
                                        <div className="grid grid-cols-2 place-items-center ">
                                            <div className=" font-teamdao text-4xl tracking-widest font-bold ">{matchData.teams[0].score}</div>
                                            <div className=" font-teamdao text-4xl tracking-widest font-bold ">{matchData.teams[1].score}</div>
                                        </div>
                                        {/* stake */}
                                        <div className="grid grid-cols-3 place-items-center">
                                            <div className="flex items-center justify-center flex-col gap-1">
                                                <div className="font-teamdao text-xl tracking-widest font-semibold ">{matchData.bettors.reduce((sum, bettor) => sum + (bettor.teamid === matchData.teams[0].id ? bettor.amount : 0), 0)}</div>
                                                <div className="text-teamdao-primary">$ALGO</div>
                                            </div>
                                            <div className="text-teamdao-primary">STAKED</div>
                                            <div className="flex items-center justify-center flex-col gap-1">
                                                <div className=" font-teamdao text-xl tracking-widest font-semibold ">{matchData.bettors.reduce((sum, bettor) => sum + (bettor.teamid === matchData.teams[1].id ? bettor.amount : 0), 0)}</div>
                                                <div className="text-teamdao-primary">$ALGO</div>
                                            </div>
                                        </div>
                                        {/* stakers */}
                                        <div className="grid grid-cols-3 place-items-center">
                                            <div className="flex items-center justify-center flex-col gap-1">
                                                <div className=" font-teamdao text-xl tracking-widest font-semibold ">{matchData.bettors.reduce((sum, bettor) => sum + (bettor.teamid === matchData.teams[0].id ? 1 : 0), 0)}</div>
                                            </div>
                                            <div className="text-teamdao-primary">STAKERS</div>
                                            <div className="flex items-center justify-center flex-col gap-1">
                                                <div className=" font-teamdao text-xl tracking-widest font-semibold ">{matchData.bettors.reduce((sum, bettor) => sum + (bettor.teamid === matchData.teams[1].id ? 1 : 0), 0)}</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </Card>
                        )}
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-2 h-96 lg:h-[90vh] lg:flex-[70%]">
                    <Player src="https://www.youtube.com/watch?v=YXohK05DnrI" />
                </div>
            </div>
        </Page>
    )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { query } = ctx
    await dbConnect()
    const MATCH = await match.findOne({ id: { $eq: query['id'] } }, { _id: 0, profit: 0, createdBy: 0 })
    return MATCH ? { props: { data: JSON.stringify(MATCH) } } : { props: {}, redirect: { destination: "/matches/404" } }
}