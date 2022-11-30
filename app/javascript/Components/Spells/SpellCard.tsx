import React, { useState } from 'react'
import { Card } from 'semantic-ui-react'
import { ISpellType } from '../../Api'
import SpellModal from './SpellModal'

interface SpellCardProps {
    spell: ISpellType
}

const SpellCard = ({ spell }: SpellCardProps) => {
    const [open, setOpen] = useState(false)

    return (
        <Card key={spell.id} onClick={() => setOpen(true)}>
            <Card.Content>
                <Card.Header>{spell.name}</Card.Header>
                <Card.Meta>Level {spell.level}</Card.Meta>
                <Card.Meta>{spell.school}</Card.Meta>
            </Card.Content>
            <Card.Content extra>
                <Card.Meta>{spell.archetypes.join(', ')}</Card.Meta>
            </Card.Content>
            <SpellModal spell={spell} open={open} setOpen={setOpen} />
        </Card>
    )
}

export default SpellCard