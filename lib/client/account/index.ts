type AccountData = {
    address: string,
    wallet: string,
    avatar: string,
    created: number
}
export default async function Account(address: string, providerId: string): Promise<AccountData> {
    const ACCOUNTDATA: AccountData = await fetch(`/api/client/account/${address}/${providerId}`).then(res => res.json())
    return ACCOUNTDATA
}