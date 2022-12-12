import React, { useState } from "react"
import { Card, Grid, Icon } from "semantic-ui-react"
import { Link } from "react-router-dom"
import { Client, ICharacterType } from "../../Api"
import { ConfirmModal } from "../Shared"
import { useAuth } from "../../Auth"
import { useError } from "../../Errors"

interface CharacterCardProps {
    character: ICharacterType
    deleteCharacter: VoidFunction
}

const CharacterCard = ({character, deleteCharacter}: CharacterCardProps) => {
    const [open, setOpen] = useState(false)
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    const openDeleteModal = (event) => {
        event.preventDefault()
        setOpen(true)
    }

    const submit = (event) => {
        event.preventDefault()
        client.destroy({ path: `/characters/${character.id}`, token: auth.getToken() })
            .then(response => {
                deleteCharacter()
                setOpen(false)
            })
            .catch(error => errors.setError(error))
    }

    return (
        <Card key={character.id} as={Link} to={`/characters/${character.id}`}>
            <Card.Content>
                <Grid>
                    <Grid.Column width={13}>
                        <Card.Header>{character.name}</Card.Header>
                    </Grid.Column>
                    <Grid.Column onClick={openDeleteModal}>
                        <Icon name='trash alternate' color='grey'/>
                    </Grid.Column>
                </Grid>
            </Card.Content>
            <Card.Content>
                <Card.Meta>{character.archetype}</Card.Meta>
                <Card.Meta>Level {character.level}</Card.Meta>
            </Card.Content>
            <ConfirmModal
                copy={`Delete ${character.name}`}
                open={open}
                setOpen={setOpen}
                onSubmit={submit}
            >
                <p>Are you sure you want to delete {character.name}</p>
            </ConfirmModal>
        </Card>
    )
}

export default CharacterCard