import React, { useEffect, useState } from 'react'
import { Button } from '../Components/ui'
import { useAuth } from '../Auth'
import { useError } from '../Errors'
import { Client, IGameType } from '../Api'
import { GameCard, GameForm } from '../Components/Games'

interface GameAttrs {
    name: string;
    description: string;
    start_date?: string;
}


const Dashboard = () => {
    const [open, setOpen] = useState(false)
    const [games, setGames] = useState<IGameType[]>([])
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    const fetchGames = () => {
        return client.get({ path: '/games', token: auth.getToken() })
            .then(response => setGames(response.data))
            .catch(error => errors.setError(error))
    }

    useEffect(() => {
        fetchGames()
    }, [])

    const addGame = (attrs: GameAttrs) => {
        return client.post({ path: '/games', payload: attrs, token: auth.getToken() })
            .then(response => setGames([...games, response.data]))
            .catch(error => errors.setError(error))
    }

    const deleteGame = (game: IGameType): Promise<any> => {
        return client.destroy({ path: `/games/${game.id}`, token: auth.getToken() })
            .then(data => fetchGames())
            .catch(error => errors.setError(error))
    }

    const gameCards = games.map(game => {
        return <GameCard key={game.id} game={game} deleteGame={deleteGame} />
    })

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Games</h1>
                <Button onClick={() => setOpen(true)}>Create Game</Button>
            </div>
            {gameCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gameCards}
                </div>
            ) : (
                <p className="text-muted-foreground">You are not in any games</p>
            )}
            <GameForm open={open} setOpen={setOpen} onSubmit={addGame} />
        </>
    )
}

export default Dashboard