import React, { useState } from 'react'
import { TableRow, TableCell } from '../ui'
import { X } from 'lucide-react'
import { IItemType } from '../../Api'
import ItemForm from './ItemForm'

const ItemRow = ({item}: {item: IItemType}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <TableRow key={item.id} onClick={() => setIsOpen(true)} className="cursor-pointer">
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.item_type}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.quality}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell>{item.requires_attunement ? 'true' : 'false'}</TableCell>
                <TableCell><X className="h-4 w-4" /></TableCell>
            </TableRow>
            <ItemForm item={item} open={isOpen} close={() => setIsOpen(false)} />
        </>
    )
}

export default ItemRow