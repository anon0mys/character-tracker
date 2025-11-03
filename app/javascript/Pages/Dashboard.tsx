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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 sm:mb-2 text-neon-cyan">Games</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Manage your D&D campaigns and adventures</p>
                </div>
                <Button onClick={() => setOpen(true)} size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 neon-glow min-h-[44px]">Create Game</Button>
            </div>
            {gameCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gameCards}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="text-center space-y-4">
                        <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                            <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-1">No games yet</h3>
                            <p className="text-muted-foreground mb-4">Get started by creating your first game</p>
                            <Button onClick={() => setOpen(true)}>Create Your First Game</Button>
                        </div>
                    </div>
                </div>
            )}
            <GameForm open={open} setOpen={setOpen} onSubmit={addGame} />
        </>
    )
}

export default Dashboard