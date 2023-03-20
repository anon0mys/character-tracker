import React, { useEffect, useRef, useState } from 'react'
import {
    Button,
    Box,
    Heading,
    Flex,
    Spacer,
    SimpleGrid,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    Wrap,
    useDisclosure
} from '@chakra-ui/react'
import { ItemForm, ItemRow } from '../Components/Items'
import { useAuth } from '../Auth'
import { useError } from '../Errors'
import { Client, IItemType } from '../Api'
import { Search } from 'semantic-ui-react'

const Items = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
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

    const handleSearchChange = (event, data) => {
        clearTimeout(timeoutRef.current)
        setSearch(data.value)

        timeoutRef.current = setTimeout(() => {
            if (data.value.length === 0) {
                fetchItems()
                return
            }

            fetchItems()
        }, 300)
    }

    const itemRows = items.map(item => <ItemRow key={item.id} item={item} />)

    return (
        <>
            <Flex>
                <Heading>Items</Heading>
                <Spacer />
                <Button onClick={onOpen}>Add Item</Button>
            </Flex>
            <SimpleGrid columns={{ sm: 1, md: 5 }} py='20px'>
                <Box py='10px'>
                    <Search
                        loading={loading}
                        placeholder='Search...'
                        onSearchChange={handleSearchChange}
                        resultRenderer={undefined}
                        showNoResults={false}
                        value={search}
                    />
                </Box>
                <Wrap py={{ sm: '15px' }}>
                </Wrap>
            </SimpleGrid>
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