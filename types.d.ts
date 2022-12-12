//match info
declare interface Match {
    id: string,
    teams: {
        id: string,
        name: string,
        logo: string,
        score: number
    }[],
    stakingStart: number,
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
        final: boolean,
        by: string
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
    created: Number,
}
//api response type
declare type ApiResponse = {
    status: boolean,
    title?: string,
    message?: string
} | "Internal Server Error" | "Unauthorized"