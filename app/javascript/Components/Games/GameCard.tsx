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
        <Card key={game.id} onClick={setGame} className="cursor-pointer hover:border-primary/50 transition-all duration-300 border-2 border-primary/20 bg-card/80 backdrop-blur-sm hover:neon-glow group overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors text-neon-cyan">{game.name}</h3>
                    <button 
                        onClick={openDeleteModal}
                        className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-destructive/10 transition-colors z-10"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                {game.start_date && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-muted-foreground">Start Date:</span>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">{game.start_date}</span>
                    </div>
                )}
                {game.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{game.description}</p>
                )}
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