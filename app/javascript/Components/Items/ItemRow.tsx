import React, { useEffect, useState } from 'react'
import { Tr, Td, useDisclosure} from '@chakra-ui/react'
import { IItemType } from '../../Api'
import ItemForm from './ItemForm'

const ItemRow = ({item}: {item: IItemType}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Tr key={item.id} onClick={onOpen}>
            <Td>{item.name}</Td>
            <Td>{item.item_type}</Td>
            <Td>{item.status}</Td>
            <Td>{item.quality}</Td>
            <Td isNumeric>{item.quantity}</Td>
            <Td>{item.requires_attunement ? 'true' : 'false'}</Td>
            // Todo: Add actions here (delete, maybe edit?)
            <ItemForm item={item} open={isOpen} close={onClose} />
        </Tr>
    )
}

export default ItemRow