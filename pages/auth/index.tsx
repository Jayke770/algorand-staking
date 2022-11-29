import { Button, Card, List, ListInput, Page } from 'konsta/react'
import Head from 'next/head'
export default function Auth() {
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
                        <div className='flex justify-center items-center'>
                            <img
                                alt=''
                                src='/assets/logo.png' />
                        </div>
                        <List
                            margin='m-0'>
                            <ListInput
                                outline
                                colors={{
                                    outlineLabelBgMaterial: 'bg-md-light-surface-1 dark:bg-md-dark-surface-1'
                                }}
                                floatingLabel
                                label="Username"
                                placeholder='Username' />
                            <ListInput
                                outline
                                colors={{
                                    outlineLabelBgMaterial: 'bg-md-light-surface-1 dark:bg-md-dark-surface-1'
                                }}
                                floatingLabel
                                label="Password"
                                placeholder='Password' />
                            <div className='px-3 mt-4'>
                                <Button className=' k-color-brand-teamdao-primary'>Login</Button>
                            </div>
                        </List>
                    </div>
                </Card>
            </div>
        </Page>
    )
}