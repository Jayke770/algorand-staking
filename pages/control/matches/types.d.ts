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
    created: Number,
}