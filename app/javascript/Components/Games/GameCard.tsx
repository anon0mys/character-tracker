import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardDescription } from "../ui"
import { Trash2 } from "lucide-react"
import { useGame } from "../../Contexts"
import { IGameType } from "../../Api"
import { ConfirmModal } from "../Shared"
import { useNavigate } from "react-router-dom"

interface GameCardProps {
    game: IGameType
    deleteGame: (game: IGameType) => Promise<any>;
}

const GameCard = ({ game, deleteGame }: GameCardProps) => {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate();
    const { setCurrentGame } = useGame()

    const openDeleteModal = (event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setOpen(true)
    }

    const setGame = (event: React.MouseEvent) => {
        event.preventDefault()
        console.log('setting game', game)
        setCurrentGame(game)
        navigate('/characters')
    }

    const submit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        deleteGame(game).then(() => setOpen(false))
    }

    return (
        <Card key={game.id} onClick={setGame} className="cursor-pointer hover:bg-accent transition-colors">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{game.name}</h3>
                    <button 
                        onClick={openDeleteModal}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            </CardHeader>
            <CardContent>
                <CardDescription>Start Date: {game.start_date || 'N/A'}</CardDescription>
                <CardDescription className="mt-2">{game.description}</CardDescription>
            </CardContent>
            <ConfirmModal
                copy={`Delete ${game.name}`}
                open={open}
                setOpen={setOpen}
                onSubmit={submit}
            >
                <p>Are you sure you want to delete {game.name}</p>
            </ConfirmModal>
        </Card>
    )
}

export default GameCard