import useSWR from 'swr'
const fetcher = (url: any) => fetch(url).then((res) => res.json())
type Match = {
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
        txInfo: TxInfo,
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
type Types = {
    matchesData?: {
        today: Match[],
        yesterday: Match[],
        tomorrow: Match[]
    },
    matchesLoading: boolean,
    matchesError: boolean
}
export default function Teams() {
    const { data, error } = useSWR('/api/client/matches', fetcher, {
        shouldRetryOnError: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshWhenHidden: true,
        refreshInterval: 20000
    })
    const x: Types = {
        matchesData: data,
        matchesLoading: !error && !data,
        matchesError: error
    }
    return x
}
