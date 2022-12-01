import { useState, useContext, useEffect } from 'react'
import { Actions, Button, Card, Fab, List, ListInput, Navbar, NavbarBackLink, Page } from "konsta/react"
import Head from "next/head"
import { useRouter } from "next/router"
import { MdAdd } from "react-icons/md"
import { Swal } from '../../../lib'
import { matchTypes, ws } from '../../../lib/control'
import { MatchTypesLoader, MatchType, MatchTypesEmpty } from '../../../components/control'
interface NewMatchType {
    opened?: boolean,
    name?: string,
    emoji?: string,
    gc?: string
}
type PostResponse = {
    status: boolean,
    title?: string,
    message?: string
}
interface TypesList {
    name: string,
    gc: string,
    emoji: string,
    _id: string,
    __v?: any
}
export default function MatchTypes() {
    const socket = useContext(ws)
    const router = useRouter()
    const { typesData, typesLoading } = matchTypes()
    const [newType, setNewType] = useState<NewMatchType>()
    const [TypesList, setTypesList] = useState<TypesList[]>()
    const _more = (): void => {
        socket.emit("match-types", {}, (res: TypesList[]) => setTypesList(res))
    }
    const _save = (): void => {
        if (newType?.name && newType?.emoji && newType.gc) {
            Swal.fire({
                icon: 'question',
                titleText: "Save match type",
                text: "Are you sure you want to save this Match Type?",
                backdrop: true,
                allowOutsideClick: false,
                showDenyButton: true,
                confirmButtonText: 'Yes',
                reverseButtons: true
            }).then((a) => {
                if (a.isConfirmed) {
                    Swal.fire({
                        icon: 'info',
                        titleText: "Saving match type",
                        text: "Please wait...",
                        backdrop: true,
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        willOpen: async (): Promise<void> => {
                            Swal.showLoading(Swal.getConfirmButton())
                            try {
                                await fetch('/api/control/matches/type/new', {
                                    method: 'POST',
                                    headers: {
                                        'content-type': 'application/json'
                                    },
                                    body: JSON.stringify({ name: newType?.name, emoji: newType?.emoji, gc: newType?.gc })
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
                                            if (res.status) setNewType({ ...newType, name: '', emoji: '', gc: '' })
                                        })
                                    } else {
                                        throw new Error(`${req.status} ${req.statusText}`)
                                    }
                                })
                            } catch (e: any) {
                                Swal.fire({
                                    icon: "error",
                                    titleText: "Connection error",
                                    text: e.message,
                                    backdrop: true,
                                    allowOutsideClick: false,
                                })
                            }
                        }
                    })
                }
            })
        }
    }
    const _delete = (id: string): void => {
        if (id) {
            Swal.fire({
                icon: 'question',
                titleText: 'Delete Match Type',
                text: "Are you sure you want to delete this Match Type?",
                backdrop: true,
                allowOutsideClick: false,
                showDenyButton: true,
                confirmButtonText: "Yes",
                reverseButtons: true
            }).then((a) => {
                if (a.isConfirmed) {
                    Swal.fire({
                        icon: 'info',
                        titleText: 'Deleting Match Type',
                        text: "Please wait...",
                        backdrop: true,
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        willOpen: async (): Promise<void> => {
                            Swal.showLoading(Swal.getConfirmButton())
                            try {
                                await fetch('/api/control/matches/type/delete', {
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
    useEffect(() => {
        if (typesData) setTypesList(typesData)
    }, [typesData])
    return (
        <Page>
            <Head>
                <title>Match Types</title>
            </Head>
            <Navbar
                colors={{
                    textMaterial: 'text-md-light-on-surface dark:text-teamdao-primary'
                }}
                title="Match Types"
                left={<NavbarBackLink onClick={() => router.push("/control")} />} />
            <div className='grid gap-2.5 p-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {typesLoading ? <MatchTypesLoader /> : null}
                {TypesList?.map((_) => (
                    <MatchType
                        key={_.name}
                        id={_._id}
                        name={_.name}
                        emoji={_.emoji}
                        gc={_.gc}
                        onDelete={(id) => _delete(id)}
                        onUpdate={(id, name, gc) => console.log()} />
                ))}
                {!typesLoading && TypesList?.length === 0 ? <MatchTypesEmpty /> : null}
            </div>
            <Actions
                onBackdropClick={() => setNewType({ ...newType, opened: false })}
                opened={newType?.opened}>
                <Card
                    header={"New Match Type"}
                    contentWrapPadding={'p-1'}>
                    <List margin='m-0'>
                        <ListInput
                            //@ts-ignore
                            onInput={(e) => setNewType({ ...newType, name: e.currentTarget.value })}
                            colors={{
                                outlineLabelBgMaterial: 'bg-md-light-surface dark:bg-md-dark-surface-1',
                                outlineBorderMaterial: "border-md-light-on-surface dark:border-md-dark-on-surface/30"
                            }}
                            value={newType?.name}
                            floatingLabel
                            placeholder='Name'
                            label="Name"
                            outline />
                        <ListInput
                            //@ts-ignore
                            onInput={(e) => setNewType({ ...newType, emoji: e.currentTarget.value })}
                            colors={{
                                outlineLabelBgMaterial: 'bg-md-light-surface dark:bg-md-dark-surface-1',
                                outlineBorderMaterial: "border-md-light-on-surface dark:border-md-dark-on-surface/30"
                            }}
                            value={newType?.emoji}
                            floatingLabel
                            placeholder='Emoji'
                            label="Emoji"
                            outline />
                        <ListInput
                            //@ts-ignore
                            onInput={(e) => setNewType({ ...newType, gc: e.currentTarget.value })}
                            colors={{
                                outlineLabelBgMaterial: 'bg-md-light-surface dark:bg-md-dark-surface-1',
                                outlineBorderMaterial: "border-md-light-on-surface dark:border-md-dark-on-surface/30"
                            }}
                            value={newType?.gc}
                            floatingLabel
                            label="Group Chat ID"
                            placeholder="Group Chat ID"
                            outline />
                        <div className='px-3.5 pt-2 pb-3'>
                            <Button
                                onClick={_save}
                                disabled={!newType?.name || !newType?.emoji || !newType.gc}
                                className=' k-color-brand-teamdao-primary'>Save</Button>
                        </div>
                    </List>
                </Card>
            </Actions>
            <Fab
                onClick={() => setNewType({ ...newType, opened: true })}
                text="New Match Type"
                icon={<MdAdd />}
                className=" k-color-brand-teamdao-primary fixed z-10 bottom-3 right-3" />
        </Page>
    )
}