import React, { useEffect, useState } from 'react'
import {
    Button, Checkbox, FormControl, FormLabel, Input, Modal, ModalContent, ModalFooter,
    ModalHeader, ModalOverlay, Select, Stack,
    NumberInput, NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper, ModalBody
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { Client, IItemType, item_types, qualities, statuses } from '../../Api'
import { useAuth } from '../../Auth'
import { useError } from '../../Errors'

interface ItemFormProps {
    item?: IItemType
    open: boolean
    close: VoidFunction
}

const NumberField = (props) => {
    return (
        <NumberInput min={0} max={99999} {...props}>
            <NumberInputField />
            <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
            </NumberInputStepper>
        </NumberInput>
    )
}

const ItemForm = ({ item, open, close }: ItemFormProps) => {
    const [itemData, setItemData] = useState<IItemType>({
        name: '',
        description: '',
        item_type: '',
        status: '',
        quality: '',
        potential_damage: 0,
        total_charges: 0,
        value: 0,
        quantity: 0,
        requires_attunement: false,
        ac: 0,
        stat_bonuses: {}
    })
    const auth = useAuth()
    const client = Client()
    const errors = useError()
    
    useEffect(() => {
        item && setItemData(item)
    }, [])

    const makeRequest = () => {
        var path = '/items'
        if (itemData.id) {
            path += `/${itemData.id}`
            return client.patch({ path: path, token: auth.getToken(), payload: itemData })
        } else {
            return client.post({ path: path, token: auth.getToken(), payload: itemData })
        }
    }

    const submit = () => {
        makeRequest()
        .then(response => {
            console.log('probably add a banner indicating success here')
            close()
        })
        .catch(error => errors.setError(error))
    }

    const itemTypeOptions = item_types.map(item_type => {
        return <option key={item_type} value={item_type}>{item_type}</option>
    })

    const statusOptions = statuses.map(status => {
        return <option key={status} value={status}>{status}</option>
    })

    const qualityOptions = qualities.map(quality => {
        return <option key={quality} value={quality}>{quality}</option>
    })

    return (
        <Modal isOpen={open} onClose={close}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add to Spell List</ModalHeader>
                <ModalBody>
                    <Stack>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input
                                value={itemData.name}
                                placeholder='Item name'
                                onChange={e => setItemData({ ...itemData, name: e.target.value })}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Input
                                value={itemData.description}
                                placeholder='Item description'
                                onChange={e => setItemData({ ...itemData, description: e.target.value })}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Item Type</FormLabel>
                            <Select
                                value={itemData.item_type}
                                placeholder='Select item type'
                                onChange={e => setItemData({ ...itemData, item_type: e.target.value })}
                            >
                                {itemTypeOptions}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Status</FormLabel>
                            <Select
                                value={itemData.status}
                                placeholder='Select item status'
                                onChange={e => setItemData({ ...itemData, status: e.target.value })}
                            >
                                {statusOptions}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Quality</FormLabel>
                            <Select
                                value={itemData.quality}
                                placeholder='Select item quality'
                                onChange={e => setItemData({ ...itemData, quality: e.target.value })}
                            >
                                {qualityOptions}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Potential Damage</FormLabel>
                            <NumberField
                                defaultValue={0}
                                value={itemData.potential_damage || 0}
                                onChange={e => setItemData({ ...itemData, potential_damage: e })}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Total Charges</FormLabel>
                            <NumberField
                                defaultValue={0}
                                value={itemData.total_charges || 0}
                                onChange={e => setItemData({ ...itemData, total_charges: e })}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Value</FormLabel>
                            <NumberField
                                defaultValue={0}
                                value={itemData.value || 0}
                                onChange={e => setItemData({ ...itemData, value: e })}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Quantity Owned</FormLabel>
                            <NumberField
                                defaultValue={0}
                                value={itemData.quantity || 0}
                                onChange={e => setItemData({ ...itemData, quantity: e })}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Requires Attunement</FormLabel>
                            <Checkbox
                                isChecked={itemData.requires_attunement}
                                onChange={e => setItemData({ ...itemData, requires_attunement: !itemData.requires_attunement })}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Item AC Bonus</FormLabel>
                            <NumberField
                                defaultValue={0}
                                value={itemData.ac || 0}
                                onChange={e => setItemData({ ...itemData, ac: e })}
                            />
                        </FormControl>
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Button
                        leftIcon={<CheckIcon />}
                        colorScheme='teal'
                        variant='solid'
                        onClick={submit}
                    >
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ItemForm