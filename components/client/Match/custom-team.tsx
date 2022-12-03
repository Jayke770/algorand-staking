type props = {
    seleted?: string,
    teams: {
        id: string,
        name: string,
        logo: string,
        score: Number
    }[],
    teamsCount: number
}
export default function CustomTeams({ teams, seleted, teamsCount }: props) {
    return (
        <div className="col-span-5 grid w-full px-0.5 pt-1.5">
            <div className="mt-3">
                {teamsCount < 5 ? (
                    <div className="flex flex-wrap items-center gap-2 pl-5">
                        {teams.map((team) => (
                            <img
                                key={team.name}
                                className={`inline-flex w-12 h-12 dark:bg-blue-700 rounded-full object-contain ring-2 ring-white`}
                                src={team.logo}
                                alt={team.name} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center gap-2 pl-5">
                        {teams.length > 8 ? (
                            <>
                                {teams.slice(0, 7).map((team, i) => (
                                    <img
                                        key={i}
                                        className={`inline-flex w-7 h-7 first:ml-0 -ml-4 relative dark:bg-blue-700 rounded-full object-contain ring-2 ${user_bet && user_bet.teamID === team.id ? 'ring-primary' : 'ring-white'}`}
                                        src={`/api/teams/${team.id}`}
                                        alt={team.name} />
                                ))}
                                <div className="`inline-flex w-7 h-7 first:ml-0 -ml-4 relative dark:bg-blue-700 rounded-full object-contain ring-2 ring-white">
                                    <p className="text-center font-semibold text-base"> +{teamsCount - 7}</p>
                                </div>
                            </>
                        ) : (
                            teams.map((team, i) => (
                                <img
                                    key={i}
                                    className={`inline-flex w-7 h-7 first:ml-0 -ml-4 relative dark:bg-blue-700 rounded-full object-contain ring-2 ${user_bet && user_bet.teamID === team.id ? 'ring-primary' : 'ring-white'}`}
                                    src={`/api/teams/${team.id}`}
                                    alt={team.name} />
                            ))
                        )}
                    </div>
                )}
            </div>
            <div className="mt-2 grid grid-cols-3">
                <div className="flex justify-center items-center gap-1">
                    <span>1 = </span>
                    <span className="text-teamdao-primary">31</span>
                </div>
                <div />
                <div className="flex justify-center items-center gap-1">
                    <span>1 = </span>
                    <span className="text-red-500">31</span>
                </div>
            </div>
        </div>
    )
}