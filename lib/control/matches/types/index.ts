import useSWR from 'swr'
const fetcher = (url: any) => fetch(url).then((res) => res.json())
type Types = {
    typesData?: {
        name: string,
        gc: string,
        emoji: string,
        _id: string,
        __v?: any
    }[],
    typesLoading: boolean,
    typesError: boolean
}
export default function Teams() {
    const { data, error } = useSWR('/api/control/matches/type', fetcher, {
        shouldRetryOnError: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshWhenHidden: true,
        refreshInterval: 20000
    })
    const x: Types = {
        typesData: data,
        typesLoading: !error && !data,
        typesError: error
    }
    return x
}
