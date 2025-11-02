import React, { useState } from "react"
import { Card, CardContent } from "../ui"
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
        <>
            <Card key={spellList.id} onClick={() => setOpen(true)} className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4">
                    {spellList.name}
                </CardContent>
            </Card>
            <SpellListModal spellList={spellList} open={open} setOpen={setOpen} />
        </>
    )
}

export default SpellListCard