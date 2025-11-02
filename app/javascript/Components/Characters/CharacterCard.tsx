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
            <Card key={character.id} className="cursor-pointer hover:bg-accent transition-colors">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{character.name}</h3>
                        <button 
                            onClick={openDeleteModal}
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    <CardDescription>{character.archetype}</CardDescription>
                    <CardDescription className="mt-1">Level {character.level}</CardDescription>
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