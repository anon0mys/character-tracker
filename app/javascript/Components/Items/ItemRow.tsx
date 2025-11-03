import React, { useState } from 'react'
import { TableRow, TableCell } from '../ui'
import { X } from 'lucide-react'
import { IItemType } from '../../Api'
import ItemForm from './ItemForm'

const ItemRow = ({item}: {item: IItemType}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <TableRow key={item.id} onClick={() => setIsOpen(true)} className="cursor-pointer hover:bg-accent/50 transition-colors group">
                <TableCell className="font-medium group-hover:text-primary transition-colors text-sm sm:text-base">{item.name}</TableCell>
                <TableCell className="text-xs sm:text-sm hidden md:table-cell">{item.item_type}</TableCell>
                <TableCell className="hidden lg:table-cell">
                    <span className="px-2 py-1 bg-muted rounded text-xs">{item.status}</span>
                </TableCell>
                <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{item.quality}</TableCell>
                <TableCell className="text-right font-semibold text-xs sm:text-sm hidden md:table-cell">{item.quantity}</TableCell>
                <TableCell className="hidden lg:table-cell">
                    {item.requires_attunement ? (
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">Yes</span>
                    ) : (
                        <span className="text-xs sm:text-sm text-muted-foreground">No</span>
                    )}
                </TableCell>
                <TableCell>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsOpen(true)
                        }}
                        className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Edit item"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </TableCell>
            </TableRow>
            <ItemForm item={item} open={isOpen} close={() => setIsOpen(false)} />
        </>
    )
}

export default ItemRow