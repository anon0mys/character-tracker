import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardDescription } from "../ui"
import { Trash2 } from "lucide-react"
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

    const openDeleteModal = (event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setOpen(true)
    }

    const submit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        client.destroy({ path: `/characters/${character.id}`, token: auth.getToken() })
            .then(response => {
                deleteCharacter()
                setOpen(false)
            })
            .catch(error => errors.setError(error))
    }

    return (
        <Link to={`/characters/${character.id}`}>
            <Card key={character.id} className="cursor-pointer hover:border-primary/50 transition-colors group h-full">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{character.name}</h3>
                        <button 
                            onClick={openDeleteModal}
                            className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-destructive/10 transition-colors z-10"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                            {character.archetype}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-muted-foreground">Level</span>
                        <span className="font-semibold text-primary">{character.level}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-muted-foreground">Race</span>
                        <span>{character.race}</span>
                    </div>
                </CardContent>
            </Card>
            <ConfirmModal
                copy={`Delete ${character.name}`}
                open={open}
                setOpen={setOpen}
                onSubmit={submit}
            >
                <p>Are you sure you want to delete {character.name}</p>
            </ConfirmModal>
        </Link>
    )
}

export default CharacterCard