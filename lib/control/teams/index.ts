import useSWR from 'swr'
const fetcher = (url: any) => fetch(url).then((res) => res.json())
type Teams = {
    teamsData?: {
        id: string,
        name: string,
        logo: string,
        created: string,
        createdBy: string,
        _id?: string,
        __v?: any
    }[],
    teamsLoading: boolean,
    teamsError: boolean
}
export default function Teams() {
    const { data, error } = useSWR('/api/control/team', fetcher, {
        shouldRetryOnError: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        refreshWhenHidden: false,
        refreshInterval: 0
    })
    const x: Teams = {
        teamsData: data,
        teamsLoading: !error && !data,
        teamsError: error
    }
    return x
}
