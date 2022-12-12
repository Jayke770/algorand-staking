import { useState, useEffect } from "react"
type AccountData = {
    address: string,
    wallet: string,
    avatar: string,
    created: number,
    balance?: number
}
const useAccount = () => {
    const [accountData, setAccountData] = useState<AccountData>()
    let storedAddress: string, storedProviderID: string
    const _getAccountData = async (address?: string, providerId?: string): Promise<void> => {
        const ACCOUNTDATA: AccountData = await fetch(`/api/client/account/${address || storedAddress}/${providerId || storedProviderID}`).then(res => res.json())
        setAccountData(ACCOUNTDATA)
    }
    useEffect(() => {
        window.addEventListener("blur", () => _getAccountData)
        return () => {
            window.removeEventListener("blur", () => _getAccountData)
        }
    }, [])
    return { accountData, _getAccountData }
}
export default useAccount