import { useState, useContext, useEffect, useRef } from 'react'
import { Actions, Button, Card, Fab, List, ListInput, Navbar, NavbarBackLink, Page, Preloader } from "konsta/react"
import Head from "next/head"
import { useRouter } from "next/router"
import { MdAdd } from 'react-icons/md'
import { TeamCard, TeamEmpty, TeamLoader } from '../../../components/control'
import validator from 'validator'
import { Swal } from '../../../lib'
import { ws, teams } from '../../.././lib/control'
import InfiniteScroll from 'react-infinite-scroller'
interface newTeam {
    opened?: boolean,
    name?: string | null,
    logo?: string | null,
    id?: string | null
}
type PostResponse = {
    status: boolean,
    title?: string,
    message?: string
}
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
export default function Teams() {
    const socket = useContext(ws)
    const router = useRouter()
    const searchRef = useRef<HTMLInputElement | null>(null)
    const { teamsData, teamsLoading } = teams()
    const [TeamList, setTeamList] = useState<TeamList>({
        data: [],
        all: [],
        more: false,
        searching: false,
    })
    const [newTeam, setNewTeam] = useState<newTeam>({
        opened: false,
        name: null,
        logo: null
    })
    const [newEditTeam, setEditTeam] = useState<newTeam>({
        opened: false,
        id: null,
        name: null,
        logo: null
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
    const _saveTeam = async (): Promise<void> => {
        if (newTeam?.logo && newTeam?.name) {
            Swal.fire({
                icon: 'question',
                titleText: "Save New Team",
                text: "Are you sure you want to save this new Team?",
                backdrop: true,
                allowOutsideClick: false,
                reverseButtons: true,
                showDenyButton: true,
                denyButtonText: 'Cancel',
                confirmButtonText: 'Save',
            }).then((a) => {
                if (a.isConfirmed) {
                    Swal.fire({
                        icon: 'info',
                        titleText: 'Saving new team',
                        text: 'Please wait...',
                        backdrop: true,
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        willOpen: async (): Promise<void> => {
                            Swal.showLoading(Swal.getConfirmButton())
                            try {
                                await fetch('/api/control/team/new', {
                                    method: 'post',
                                    headers: {
                                        'content-type': 'application/json'
                                    },
                                    body: JSON.stringify({ logo: newTeam?.logo, name: newTeam?.name })
                                }).then(async (req) => {
                                    if (req.ok) {
                                        const res: PostResponse = await req.json()
                                        _more()
                                        Swal.fire({
                                            icon: res.status ? 'success' : 'info',
                                            titleText: res?.title,
                                            text: res?.message,
                                            backdrop: true,
                                            allowOutsideClick: false,
                                        }).then(() => {
                                            if (res.status) setNewTeam({ ...newTeam, logo: '', name: '' })
                                        })
                                    } else {
                                        throw new Error(`${req.status} ${req.statusText}`)
                                    }
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
    }
    const _updateTeam = async (): Promise<void> => {
        if (newEditTeam?.logo && newEditTeam?.name) {
            Swal.fire({
                icon: 'question',
                titleText: "Update Team",
                text: "Are you sure you want to update this Team?",
                backdrop: true,
                allowOutsideClick: false,
                reverseButtons: true,
                showDenyButton: true,
                denyButtonText: 'Cancel',
                confirmButtonText: 'Update',
            }).then((a) => {
                if (a.isConfirmed) {
                    Swal.fire({
                        icon: 'info',
                        titleText: 'Updating team',
                        text: 'Please wait...',
                        backdrop: true,
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        willOpen: async (): Promise<void> => {
                            Swal.showLoading(Swal.getConfirmButton())
                            try {
                                await fetch('/api/control/team/update', {
                                    method: 'post',
                                    headers: {
                                        'content-type': 'application/json'
                                    },
                                    body: JSON.stringify({ logo: newEditTeam?.logo, name: newEditTeam?.name, id: newEditTeam?.id })
                                }).then(async (req) => {
                                    if (req.ok) {
                                        const res: PostResponse = await req.json()
                                        _more()
                                        Swal.fire({
                                            icon: res.status ? 'success' : 'info',
                                            titleText: res?.title,
                                            text: res?.message,
                                            backdrop: true,
                                            allowOutsideClick: false,
                                        }).then(() => {
                                            if (res.status) setEditTeam({ ...newEditTeam, logo: '', name: '', id: null })
                                        })
                                    } else {
                                        throw new Error(`${req.status} ${req.statusText}`)
                                    }
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
    }
    const _deleteTeam = async (id: string): Promise<void> => {
        if (id) {
            Swal.fire({
                icon: 'question',
                titleText: 'Delete Team',
                text: "Are you sure you want to delete this team?",
                backdrop: true,
                allowOutsideClick: false,
                showDenyButton: true,
                confirmButtonText: "Yes",
                reverseButtons: true
            }).then((a) => {
                if (a.isConfirmed) {
                    Swal.fire({
                        icon: 'info',
                        titleText: 'Deleting Team',
                        text: "Please wait...",
                        backdrop: true,
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        willOpen: async (): Promise<void> => {
                            Swal.showLoading(Swal.getConfirmButton())
                            try {
                                await fetch('/api/control/team/delete', {
                                    method: 'post',
                                    headers: {
                                        'content-type': 'application/json'
                                    },
                                    body: JSON.stringify({ id: id })
                                }).then(async (req) => {
                                    if (req.ok) {
                                        const res: PostResponse = await req.json()
                                        _more()
                                        Swal.fire({
                                            icon: res.status ? 'success' : 'info',
                                            titleText: res?.title,
                                            text: res?.message,
                                            backdrop: true,
                                            allowOutsideClick: false,
                                        }).then(() => {
                                            if (res.status) {
                                                setEditTeam({ ...newEditTeam, logo: '', name: '', opened: false, id: null })
                                                let DATA: {
                                                    id: string,
                                                    name: string,
                                                    logo: string,
                                                    created: string,
                                                    createdBy: string,
                                                    _id?: string,
                                                    __v?: any
                                                }[] = []
                                                TeamList.data.map((team) => {
                                                    if (team.id !== id) {
                                                        DATA = [...DATA, ...[team]]
                                                    }
                                                })
                                                setTeamList({ ...TeamList, data: DATA })
                                            }
                                        })
                                    } else {
                                        throw new Error(`${req.status} ${req.statusText}`)
                                    }
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
    }
    const _search = (val: string): void => {
        if (val) {
            socket.emit("search-team", { search: val }, (res: TeamList) => {
                setTeamList({ ...TeamList, data: res.data })
            })
        }
    }
    useEffect(() => {
        if (teamsData) setTeamList({ ...TeamList, data: teamsData, all: teamsData, more: true })
    }, [teamsData, setTeamList])
    return (
        <Page className='overflow-hidden pb-10-safe'>
            <Head>
                <title>Teams</title>
            </Head>
            <Navbar
                colors={{
                    textMaterial: 'text-md-light-on-surface dark:text-teamdao-primary'
                }}
                title="Teams"
                left={<NavbarBackLink onClick={() => router.push("/control")} />} />
            <div className='flex p-3 h-[calc(100vh-65px)] overflow-auto'>

                {teamsLoading ? <TeamLoader /> : null}
                {!teamsLoading && teamsData && teamsData?.length > 0 ? (
                    <div className='flex flex-col gap-2 w-full'>
                        <div className='flex px-1 h-12'>
                            <input
                                ref={searchRef}
                                onInput={(e) => e.currentTarget.value ? _search(e.currentTarget.value) : setTeamList({ ...TeamList, data: TeamList.all })}
                                placeholder='Search Team ID or Name'
                                className='p-3 mb-2 w-full md:w-96 rounded-lg bg-md-dark-surface-2 text-zinc-300 border-none outline-none transition-all focus:ring-1 focus:ring-offset-1 focus:ring-offset-md-dark-surface-1 focus:ring-teamdao-primary/50' />
                        </div>
                        <InfiniteScroll
                            pageStart={0}
                            hasMore={TeamList.more && !searchRef?.current?.value}
                            loadMore={_more}
                            useWindow={false}
                            className=" flex flex-col md:grid h-full w-full gap-2.5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-10"
                            loader={
                                <div className='flex w-full justify-center items-center' key={'loader'}>
                                    <Preloader className=" k-color-brand-teamdao-primary" />
                                </div>
                            }>
                            {TeamList.data.map((team) => (
                                <TeamCard
                                    key={team.name}
                                    id={team.id}
                                    name={team.name}
                                    created={team.created}
                                    logo={team.logo}
                                    onUpdate={(id, name, logo) => setEditTeam({ ...newEditTeam, opened: true, id: id, name: name, logo: logo })}
                                    onDelete={(id) => _deleteTeam(id)} />
                            ))}
                        </InfiniteScroll>
                    </div>
                ) : null}
                {!teamsLoading && teamsData && teamsData?.length <= 0 ? <TeamEmpty /> : null}
            </div>
            {/* create */}
            <Actions
                onBackdropClick={() => setNewTeam({ ...newTeam, opened: false })}
                opened={newTeam?.opened}>
                <Card
                    header={"New Team"}
                    contentWrapPadding={'p-1'}>
                    <List margin='m-0'>
                        <ListInput
                            //@ts-ignore
                            onInput={(e) => setNewTeam({ ...newTeam, name: e.currentTarget?.value })}
                            colors={{
                                outlineLabelBgMaterial: 'bg-md-light-surface dark:bg-md-dark-surface-1',
                                outlineBorderMaterial: "border-md-light-on-surface dark:border-md-dark-on-surface/30"
                            }}
                            floatingLabel
                            value={newTeam?.name}
                            placeholder='Name'
                            label="Name"
                            outline />
                        <ListInput
                            //@ts-ignore
                            onInput={(e) => setNewTeam({ ...newTeam, logo: e.currentTarget?.value })}
                            error={newTeam?.logo ? validator.isURL(newTeam?.logo) ? null : 'Invalid Logo' : null}
                            colors={{
                                outlineLabelBgMaterial: 'bg-md-light-surface dark:bg-md-dark-surface-1',
                                outlineBorderMaterial: "border-md-light-on-surface dark:border-md-dark-on-surface/30"
                            }}
                            type="text"
                            value={newTeam?.logo}
                            floatingLabel
                            label="Logo"
                            placeholder="Logo"
                            outline />
                        <div className='px-3.5 pt-2 pb-3'>
                            <Button
                                onClick={_saveTeam}
                                disabled={!newTeam?.logo || !newTeam?.name}
                                className=' k-color-brand-teamdao-primary'>Save</Button>
                        </div>
                    </List>
                </Card>
            </Actions>
            {/* edit */}
            <Actions
                onBackdropClick={() => setEditTeam({ ...newEditTeam, opened: false })}
                opened={newEditTeam?.opened}>
                <Card
                    header={"Update Team"}
                    contentWrapPadding={'p-1'}>
                    <List margin='m-0'>
                        <ListInput
                            //@ts-ignore
                            onInput={(e) => setEditTeam({ ...newEditTeam, name: e.currentTarget?.value })}
                            colors={{
                                outlineLabelBgMaterial: 'bg-md-light-surface dark:bg-md-dark-surface-1',
                                outlineBorderMaterial: "border-md-light-on-surface dark:border-md-dark-on-surface/30"
                            }}
                            floatingLabel
                            value={newEditTeam?.name}
                            placeholder='Name'
                            label="Name"
                            outline />
                        <ListInput
                            //@ts-ignore
                            onInput={(e) => setEditTeam({ ...newEditTeam, logo: e.currentTarget?.value })}
                            error={newEditTeam?.logo ? validator.isURL(newEditTeam?.logo) ? null : 'Invalid Logo' : null}
                            colors={{
                                outlineLabelBgMaterial: 'bg-md-light-surface dark:bg-md-dark-surface-1',
                                outlineBorderMaterial: "border-md-light-on-surface dark:border-md-dark-on-surface/30"
                            }}
                            type="text"
                            value={newEditTeam?.logo}
                            floatingLabel
                            label="Logo"
                            placeholder="Logo"
                            outline />
                        <div className='px-3.5 pt-2 pb-3'>
                            <Button
                                onClick={_updateTeam}
                                disabled={!newEditTeam?.logo || !newEditTeam?.name}
                                className=' k-color-brand-teamdao-primary'>Update Team</Button>
                        </div>
                    </List>
                </Card>
            </Actions>
            <Fab
                onClick={() => setNewTeam({ ...newTeam, opened: true })}
                text="New Team"
                icon={<MdAdd />}
                className=" k-color-brand-teamdao-primary fixed z-10 bottom-3 right-3" />
        </Page >
    )
}