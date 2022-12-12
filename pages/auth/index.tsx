import { Button, Card, Checkbox, List, ListInput, ListItem, Page } from 'konsta/react'
import Head from 'next/head'
import { useState } from 'react'
import type { GetServerSideProps } from 'next'
import { getSession, signIn } from 'next-auth/react'
import { Swal } from '../../lib'
import { useRouter } from 'next/router'
interface Login {
    username: string | null,
    password: string | null,
    showPassword?: boolean
}
export default function Auth() {
    const router = useRouter()
    const [login, setlogin] = useState<Login>({
        username: null,
        password: null,
        showPassword: false
    })
    const _login = async (): Promise<void> => {
        if (login?.username && login?.password) {
            Swal.fire({
                icon: 'info',
                titleText: 'Authenticating',
                text: 'Please wait...',
                backdrop: true,
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: async (): Promise<void> => {
                    Swal.showLoading(Swal.getConfirmButton())
                    await signIn('credentials', { username: login?.username, password: login?.password })
                }
            })
        }
    }
    return (
        <Page>
            <Head>
                <title>Authentication</title>
            </Head>
            <div className='w-full h-full flex justify-center items-center'>
                <Card
                    raised
                    className='w-full md:w-[400px]'>
                    <div className='py-4'>
                        <div className='flex justify-center items-center pb-5'>
                            <img
                                alt=''
                                src='/assets/logo.png'
                                className=' h-44' />
                        </div>
                        <List
                            margin='m-0'>
                            <ListInput
                                onKeyUp={(e) => e.key === 'Enter' ? _login() : null}
                                //@ts-ignore
                                onInput={(e) => setlogin({ ...login, username: e.currentTarget.value })}
                                outline
                                colors={{
                                    outlineLabelBgMaterial: 'bg-md-light-surface dark:bg-md-dark-surface-1',
                                    outlineBorderMaterial: "border-md-light-on-surface dark:border-md-dark-on-surface/30"
                                }}
                                floatingLabel
                                value={login?.username}
                                label="Username"
                                placeholder='Username' />
                            <ListInput
                                onKeyUp={(e) => e.key === 'Enter' ? _login() : null}
                                //@ts-ignore
                                onInput={(e) => setlogin({ ...login, password: e.currentTarget.value })}
                                outline
                                colors={{
                                    outlineLabelBgMaterial: 'bg-md-light-surface dark:bg-md-dark-surface-1',
                                    outlineBorderMaterial: "border-md-light-on-surface dark:border-md-dark-on-surface/30"
                                }}
                                floatingLabel
                                value={login?.password}
                                type={login?.showPassword ? 'text' : 'password'}
                                label="Password"
                                placeholder='Password' />
                            <ListItem
                                media={
                                    <Checkbox
                                        checked={login?.showPassword}
                                        onChange={() => setlogin({ ...login, showPassword: !login?.showPassword })} />
                                }
                                link
                                chevron={false}
                                onClick={() => setlogin({ ...login, showPassword: !login?.showPassword })}
                                title='Show Password' />
                            <div className='px-3 mt-4'>
                                <Button
                                    onClick={_login}
                                    disabled={!login?.password || !login?.username}
                                    className=' k-color-brand-teamdao-primary'>Login</Button>
                            </div>
                        </List>
                    </div>
                </Card>
            </div>
        </Page>
    )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const USER = await getSession(ctx)
    return USER ? { props: {}, redirect: { destination: '/control' } } : { props: {} }
}