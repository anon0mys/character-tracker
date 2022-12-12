import React, { useState } from "react"
import { Card } from "semantic-ui-react"
import { Client, ISpellListType } from "../../Api"
import { useAuth } from "../../Auth"
import { useError } from "../../Errors"
import SpellListModal from "./SpellListModal"

interface SpellListCardProps {
    spellList: ISpellListType
}

const SpellListCard = ({ spellList }: SpellListCardProps ) => {
    const [open, setOpen] = useState(false)
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    return (
        <Card key={spellList.id} onClick={() => setOpen(true)}>
            <Card.Content>
                {spellList.name}
            </Card.Content>
            <SpellListModal spellList={spellList} open={open} setOpen={setOpen} />
        </Card>
    )
}

export default SpellListCard