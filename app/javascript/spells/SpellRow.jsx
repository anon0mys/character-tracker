import React from 'react'
import { Grid } from '../elements/Containers'

const SpellRow = ({spell}) => {
    return (
        <Grid gridAutoFlow='row'>
            <span>{spell.name}</span>
            <span>{spell.archetypes}</span>
            <span>{spell.level}</span>
            <span>{spell.school}</span>
            <span>{spell.castingTime}</span>
            <span>{spell.range}</span>
            <span>{spell.duration}</span>
            <span>{spell.components}</span>
        </Grid>
    )
}

export default SpellRow