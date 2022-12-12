import { Button, Card, Checkbox, Fab, List, ListInput, ListItem, Navbar, NavbarBackLink, Page, Preloader, Tabbar, TabbarLink } from "konsta/react"
import Head from "next/head"
import { useRouter } from "next/router"
import { matchTypes, teams, ws } from "../../../lib/control"
import { useState, useEffect, useRef, useContext } from 'react'
import InfiniteScroll from "react-infinite-scroller"
import { MdChevronRight, MdArrowBack } from "react-icons/md"
import moment from 'moment'
import { Swal } from "../../../lib"
interface TeamList {
    data: {
        id: string,
        name: string,
        logo: string,
        created: string,
        createdBy: string,
        _id?: string,
        __v?: any
    }[],
    all: {
        id: string,
        name: string,
        logo: string,
        created: string,
        createdBy: string,
        _id?: string,
        __v?: any
    }[],
    more: boolean,
    searching: boolean
}
interface CreateMatch {
    teams: { id: string }[],
    start: string,
    type: string,
    step: 1 | 2,
    matchNumber?: number
}
type PostResponse = {
    status: boolean,
    title?: string,
    message?: string
}
export default function CreateMatch() {
    const socket = useContext(ws)
    const router = useRouter()
    const searchRef = useRef<HTMLInputElement | null>(null)
    const { teamsData, teamsLoading } = teams()
    const { typesData, typesLoading } = matchTypes()
    const [TeamList, setTeamList] = useState<TeamList>({
        data: [],
        all: [],
        more: false,
        searching: false,
    })
    const [createMatch, setCreateMatch] = useState<CreateMatch>({
        teams: [],
        start: '',
        type: '',
        step: 1,
        matchNumber: undefined
    })
    const _more = async (): Promise<void> => {
        if (!searchRef?.current?.value) {
            const ignore = TeamList?.data.map((team) => {
                return { id: { $ne: team.id } }
            })
            socket.emit('more-teams', { ignore: ignore }, (res: TeamList) => {
                if (res.data?.length > 0) {
                    const DATA = [...res.data, ...TeamList.data]
                    setTeamList({ ...TeamList, data: DATA, all: DATA })
                } else {
                    setTeamList({ ...TeamList, more: false })
                }
            })
        }
    }
    const _search = (val: string): void => {
        if (val) {
            socket.emit("search-team", { search: val }, (res: TeamList) => {
                setTeamList({ ...TeamList, data: res.data })
            })
        }
    }
    const _selectTeam = (id: string): void => {
        const isSelected = createMatch?.teams.find(x => x.id == id)
        if (isSelected) {
            //remove team
            let newTeams: { id: string }[] = []
            createMatch?.teams.map((x) => {
                if (x.id !== id) {
                    newTeams = [...newTeams, ...[x]]
                }
            })
            setCreateMatch({ ...createMatch, teams: newTeams })
        } else {
            setCreateMatch({ ...createMatch, teams: [...createMatch?.teams, ...[{ id: id }]] })
        }
    }
    const _create = (): void => {
        if (createMatch?.start && createMatch?.type && createMatch?.teams.length >= 2) {
            Swal.fire({
                icon: "question",
                titleText: "Create Match",
                text: "Are you sure you want to proceed?",
                backdrop: true,
                allowOutsideClick: false,
                showDenyButton: true,
                confirmButtonText: "Yes",
                reverseButtons: true
            }).then((a) => {
                if (a.isConfirmed) {
                    Swal.fire({
                        icon: 'info',
                        titleText: 'Creating Match',
                        text: "Please wait...",
                        backdrop: true,
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        willOpen: async (): Promise<void> => {
                            Swal.showLoading(Swal.getConfirmButton())
                            try {
                                await fetch("/api/control/matches/create", {
                                    method: 'POST',
                                    headers: {
                                        "content-type": "application/json"
                                    },
                                    body: JSON.stringify({ teams: createMatch?.teams, type: createMatch?.type, start: createMatch?.start, matchNumber: createMatch?.matchNumber })
                                }).then(async (req) => {
                                    if (req.ok) {
                                        const res: PostResponse = await req.json()
                                        Swal.fire({
                                            icon: res.status ? 'success' : 'info',
                                            titleText: res?.title,
                                            text: res?.message,
                                            backdrop: true,
                                            allowOutsideClick: false,
                                        }).then(() => {
                                            if (res.status) {
                                                setCreateMatch({
                                                    teams: [],
                                                    start: '',
                                                    type: '',
                                                    step: 1,
                                                    matchNumber: undefined
                                                })
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
    }
    useEffect(() => {
        if (teamsData) setTeamList({ data: teamsData, all: teamsData, more: true, searching: false })
    }, [teamsData, setTeamList])
    return (
        <Page>
            <Head>
                <title>Create Match</title>
            </Head>
            <Navbar
                colors={{
                    textMaterial: 'text-md-light-on-surface dark:text-teamdao-primary'
                }}
                title="Create Match"
                left={createMatch.step === 1 ? <NavbarBackLink className="animate__animated animate__fadeInLeft ms-300" onClick={() => router.push("/control/matches")} /> : null} />
            <div className="p-3">
                {createMatch.step === 1 ? (
                    <Card
                        className="animate__animated animate__fadeInDown ms-300"
                        margin="m-0">
                        <div className="text-2xl font-semibold px-3 py-2">Select Teams</div>
                        <List margin="m-0">
                            <div className='flex px-3 h-12 mt-4'>
                                <input
                                    ref={searchRef}
                                    onInput={(e) => e.currentTarget.value ? _search(e.currentTarget.value) : setTeamList({ ...TeamList, data: TeamList.all })}
                                    placeholder='Search Team ID or Name'
                                    className='p-3 mb-2 w-full md:w-96 rounded-lg bg-md-dark-surface-2 text-zinc-300 border-none outline-none transition-all focus:ring-1 focus:ring-offset-1 focus:ring-offset-md-dark-surface-1 focus:ring-teamdao-primary/50' />
                            </div>
                            <div className="h-[calc(100vh-240px)] overflow-auto">
                                <InfiniteScroll
                                    pageStart={0}
                                    hasMore={TeamList.more && !searchRef?.current?.value}
                                    useWindow={false}
                                    loadMore={_more}
                                    className="grid gap-2 md:grid-cols-2 lg:grid-cols-3"
                                    loader={
                                        <div className='flex w-full justify-center items-center' key={'loader'}>
                                            <Preloader className=" k-color-brand-teamdao-primary" />
                                        </div>
                                    }>
                                    {teamsLoading ? (
                                        <div className='col-span-full flex h-full w-full justify-center items-center' key={'loader'}>
                                            <Preloader className=" k-color-brand-teamdao-primary" />
                                        </div>
                                    ) : null}
                                    {TeamList.data.map((team) => (
                                        !!createMatch?.teams.find(x => x.id === team.id) ? (
                                            <ListItem
                                                key={team.name}
                                                title={team.name}
                                                link
                                                onClick={() => _selectTeam(team.id)}
                                                media={
                                                    <img
                                                        alt={team.name}
                                                        src={team.logo}
                                                        className="h-12 w-12 object-contain" />
                                                }
                                                chevron={false}
                                                after={<Checkbox className="animate__animaetd animate__bounceIn ms-500" readOnly checked />} />
                                        ) : null
                                    ))}

                                    {TeamList.data.map((team) => (
                                        !createMatch?.teams.find(x => x.id === team.id) ? (
                                            <ListItem
                                                key={team.name}
                                                title={team.name}
                                                link
                                                onClick={() => _selectTeam(team.id)}
                                                media={
                                                    <img
                                                        alt={team.name}
                                                        src={team.logo}
                                                        className="h-12 w-12 object-contain" />
                                                }
                                                chevron={false} />
                                        ) : null
                                    ))}
                                </InfiniteScroll>
                            </div>
                        </List>
                    </Card>
                ) : (
                    <div className="animate__animated animate__fadeInDown ms-300 flex flex-col gap-4 mb-20">
                        <Card margin="m-0">
                            <div className="text-2xl font-semibold px-3 py-2">Selected Teams</div>
                            <List margin="m-0">
                                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {TeamList.data.map((team) => (
                                        !!createMatch?.teams.find(x => x.id === team.id) ? (
                                            <ListItem
                                                key={team.name}
                                                title={team.name}
                                                media={
                                                    <img
                                                        alt={team.name}
                                                        src={team.logo}
                                                        className="h-12 w-12 object-contain" />
                                                }
                                                chevron={false} />
                                        ) : null
                                    ))}
                                </div>
                            </List>
                        </Card>
                        <Card margin="m-0">
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-2 items-center">
                                    <Button
                                        onClick={() => setCreateMatch({ ...createMatch, step: 1 })}
                                        rounded
                                        clear
                                        className="!w-auto k-color-brand-teamdao-primary">
                                        <MdArrowBack size="1.5rem" />
                                    </Button>
                                    <div className="text-2xl font-semibold px-3 py-2">Match Info</div>
                                </div>
                                <List margin="m-0">
                                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {typesData?.map((type) => (
                                            <ListItem
                                                key={type.name}
                                                media={type.emoji}
                                                title={type.name}
                                                link
                                                chevron={false}
                                                onClick={() => setCreateMatch({ ...createMatch, type: createMatch.type === type._id ? '' : type._id })}
                                                after={createMatch.type === type._id ? <Checkbox className="animate__animaetd animate__bounceIn ms-500" readOnly checked /> : null} />
                                        ))}
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-2.5 lg:grid-cols-3 xl:grid-cols-4 mt-10">
                                        <ListInput
                                            //@ts-ignore
                                            onInput={(e) => setCreateMatch({ ...createMatch, matchNumber: parseInt(e.currentTarget.value) })}
                                            colors={{
                                                outlineLabelBgMaterial: 'bg-md-light-surface dark:bg-md-dark-surface-1',
                                                outlineBorderMaterial: "border-md-light-on-surface dark:border-md-dark-on-surface/30"
                                            }}
                                            placeholder='Optional'
                                            label="Match Number"
                                            outline
                                            value={createMatch?.matchNumber}
                                            type="number" />
                                        <ListInput
                                            //@ts-ignore
                                            onInput={(e) => setCreateMatch({ ...createMatch, start: moment(e.currentTarget.value).format() })}
                                            colors={{
                                                outlineLabelBgMaterial: 'bg-md-light-surface dark:bg-md-dark-surface-1',
                                                outlineBorderMaterial: "border-md-light-on-surface dark:border-md-dark-on-surface/30"
                                            }}
                                            outline
                                            label="Date time"
                                            type="datetime-local"
                                            placeholder="Please choose..." />
                                    </div>
                                </List>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
            {createMatch.teams.length >= 2 && createMatch.step === 1 ? (
                <Fab
                    onClick={() => setCreateMatch({ ...createMatch, step: 2 })}
                    component="div"
                    textPosition="before"
                    text="Next"
                    icon={<MdChevronRight className="mt-[2.5px] group-hover:ml-1 transition-all" size={"1.5rem"} />}
                    className="group k-color-brand-teamdao-primary z-20 fixed bottom-3 right-3 animate__animated animate__fadeInRight ms-300" />
            ) : null}
            {createMatch.teams.length >= 2 && createMatch.start && createMatch.type && createMatch.step === 2 ? (
                <Fab
                    onClick={_create}
                    component="div"
                    textPosition="before"
                    text="Create Match"
                    className="k-color-brand-teamdao-primary z-20 fixed bottom-3 right-3 animate__animated animate__fadeInRight ms-300" />
            ) : null}
        </Page>
    )
}