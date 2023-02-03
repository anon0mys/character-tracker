import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Button,
    Heading,
    Flex,
    Spacer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    useDisclosure
} from '@chakra-ui/react'
import { ItemForm, ItemRow } from '../Components/Items'
import { useAuth } from '../Auth'
import { useError } from '../Errors'
import { Client, IItemType } from '../Api'

const Items = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [items, setItems] = useState<IItemType[]>([])
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    const fetchItems = () => {
        client.get({ path: '/items', token: auth.getToken() })
            .then(response => setItems(response.data))
            .catch(error => errors.setError(error))
    }

    useEffect(() => {
        fetchItems()
    }, [])

    useEffect(() => {
        !isOpen && fetchItems()
    }, [isOpen])

    const itemRows = items.map(item => <ItemRow key={item.id} item={item} />)

    return (
        <>
            <Flex>
                <Heading>Items</Heading>
                <Spacer />
                <Button onClick={onOpen}>Add Item</Button>
            </Flex>
            <TableContainer my='20px'>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Item Type</Th>
                            <Th>Status</Th>
                            <Th>Quality</Th>
                            <Th isNumeric>Quantity Owned</Th>
                            <Th>Attunable</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {itemRows}
                    </Tbody>
                </Table>
            </TableContainer>
            <ItemForm open={isOpen} close={onClose} />
        </>
        
    )

}

export default Items