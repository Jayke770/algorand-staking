import useSWR from 'swr'
const fetcher = (url: any) => fetch(url).then((res) => res.json())
type Types = {
    matchesData?: {
        _id?: string,
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
        profit: number,
        shareLink: string,
        liveLink: string,
        createdBy: string,
        created: string,
    }[],
    matchesLoading: boolean,
    matchesError: boolean
}
export default function Teams() {
    const { data, error } = useSWR('/api/control/matches', fetcher, {
        shouldRetryOnError: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshWhenHidden: true,
        refreshInterval: 10000
    })
    const x: Types = {
        matchesData: data,
        matchesLoading: !error && !data,
        matchesError: error
    }
    return x
}
