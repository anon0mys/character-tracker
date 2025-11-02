import React, { useEffect, useRef, useState } from 'react'
import { Button, Input, Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../Components/ui'
import { ItemForm, ItemRow } from '../Components/Items'
import { useAuth } from '../Auth'
import { useError } from '../Errors'
import { Client, IItemType } from '../Api'
import { Search } from 'lucide-react'

const Items = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [items, setItems] = useState<IItemType[]>([])
    const auth = useAuth()
    const client = Client()
    const errors = useError()
    const timeoutRef = useRef<any>()

    const fetchItems = () => {
        setLoading(true)
        let path = '/items'
        path = addFilters(path)
        client.get({ path: path, token: auth.getToken() })
            .then(response => {
                setItems(response.data)
                setLoading(false)
            })
            .catch(error => errors.setError(error))
    }

    const addFilters = (path: string) => {
        if (search) {
            path += `?name=${search}`
        }
        return path
    }

    useEffect(() => {
        fetchItems()
    }, [])

    useEffect(() => {
        !isOpen && fetchItems()
    }, [isOpen])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(timeoutRef.current)
        const value = e.target.value
        setSearch(value)

        timeoutRef.current = setTimeout(() => {
            if (value.length === 0) {
                fetchItems()
                return
            }

            fetchItems()
        }, 300)
    }

    const itemRows = items.map(item => <ItemRow key={item.id} item={item} />)

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Items</h1>
                <Button onClick={() => setIsOpen(true)}>Add Item</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 py-5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder='Search...'
                        value={search}
                        onChange={handleSearchChange}
                        className="pl-9"
                        disabled={loading}
                    />
                </div>
            </div>
            <div className="my-5">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Item Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Quality</TableHead>
                            <TableHead className="text-right">Quantity Owned</TableHead>
                            <TableHead>Attunable</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {itemRows}
                    </TableBody>
                </Table>
            </div>
            <ItemForm open={isOpen} close={() => setIsOpen(false)} />
        </>
        
    )

}

export default Items