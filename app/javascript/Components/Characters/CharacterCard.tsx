import React from "react"
import { Card } from "semantic-ui-react"
import { Link } from "react-router-dom"
import { ICharacterType } from "../../Api"

const CharacterCard = ({character}: {character: ICharacterType}) => {
    return (
        <Card key={character.id} as={Link} to={`/characters/${character.id}`}>
            <Card.Content>
                <Card.Header>{character.name}</Card.Header>
                <Card.Meta>{character.archetype}</Card.Meta>
                <Card.Meta>Level {character.level}</Card.Meta>
            </Card.Content>
        </Card>
    )
}

export default CharacterCard