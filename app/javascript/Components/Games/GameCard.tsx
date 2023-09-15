import React, { useState } from "react"
import { Card, Grid, Icon } from "semantic-ui-react"
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

    const openDeleteModal = (event) => {
        event.preventDefault()
        setOpen(true)
    }

    const setGame = (event) => {
        event.preventDefault()
        setCurrentGame(game)
        navigate('/characters')
    }

    const submit = (event) => {
        event.preventDefault()
        deleteGame(game).then(() => setOpen(false))
    }

    return (
        <Card key={game.id} onClick={setGame}>
            <Card.Content>
                <Grid>
                    <Grid.Column width={13}>
                        <Card.Header>{game.name}</Card.Header>
                    </Grid.Column>
                    <Grid.Column onClick={openDeleteModal}>
                        <Icon name='trash alternate' color='grey' />
                    </Grid.Column>
                </Grid>
            </Card.Content>
            <Card.Content>
                <Card.Meta>Start Date: {game.start_date}</Card.Meta>
                <Card.Meta>{game.description}</Card.Meta>
            </Card.Content>
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