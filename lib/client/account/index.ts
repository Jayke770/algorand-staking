import useSWR from 'swr'
const fetcher = (url: string) => fetch(url).then((res) => res.json())
export default function User(address?: string) {
    if (address) {
        const { data, error } = useSWR(`/api/client/account/${address}`, fetcher, {
            shouldRetryOnError: true,
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            refreshWhenHidden: true,
            refreshWhenOffline: true,
            refreshInterval: 30000
        })
        return {
            data: data,
            dataLoading: !error && !data,
            dataError: error
        }
    }
    return {
        data: undefined,
        dataLoading: undefined,
        dataError: undefined
    }
}