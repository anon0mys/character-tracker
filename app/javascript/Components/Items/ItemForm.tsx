import React, { useEffect, useState } from 'react'
import {
    Button, Checkbox, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../ui'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import { Check } from 'lucide-react'
import { Client, IItemType, item_types, qualities, statuses } from '../../Api'
import { useAuth } from '../../Auth'
import { useError } from '../../Errors'

interface ItemFormProps {
    item?: IItemType
    open: boolean
    close: VoidFunction
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

    return (
        <Dialog open={open} onOpenChange={close}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-primary/30 bg-card/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-neon-cyan">{item ? 'Edit Item' : 'Add Item'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={itemData.name}
                                placeholder='Item name'
                                onChange={e => setItemData({ ...itemData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={itemData.description}
                                placeholder='Item description'
                                onChange={e => setItemData({ ...itemData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="itemType">Item Type</Label>
                            <Select
                                value={itemData.item_type}
                                onValueChange={(value) => setItemData({ ...itemData, item_type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select item type' />
                                </SelectTrigger>
                                <SelectContent>
                                    {item_types.map(item_type => (
                                        <SelectItem key={item_type} value={item_type}>
                                            {item_type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={itemData.status}
                                onValueChange={(value) => setItemData({ ...itemData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select item status' />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map(status => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quality">Quality</Label>
                            <Select
                                value={itemData.quality}
                                onValueChange={(value) => setItemData({ ...itemData, quality: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select item quality' />
                                </SelectTrigger>
                                <SelectContent>
                                    {qualities.map(quality => (
                                        <SelectItem key={quality} value={quality}>
                                            {quality}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="potentialDamage">Potential Damage</Label>
                                <Input
                                    id="potentialDamage"
                                    type="number"
                                    min={0}
                                    max={99999}
                                    value={itemData.potential_damage || 0}
                                    onChange={e => setItemData({ ...itemData, potential_damage: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="totalCharges">Total Charges</Label>
                                <Input
                                    id="totalCharges"
                                    type="number"
                                    min={0}
                                    max={99999}
                                    value={itemData.total_charges || 0}
                                    onChange={e => setItemData({ ...itemData, total_charges: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="value">Value</Label>
                                <Input
                                    id="value"
                                    type="number"
                                    min={0}
                                    max={99999}
                                    value={itemData.value || 0}
                                    onChange={e => setItemData({ ...itemData, value: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity Owned</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min={0}
                                    max={99999}
                                    value={itemData.quantity || 0}
                                    onChange={e => setItemData({ ...itemData, quantity: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ac">Item AC Bonus</Label>
                                <Input
                                    id="ac"
                                    type="number"
                                    min={0}
                                    max={99999}
                                    value={itemData.ac || 0}
                                    onChange={e => setItemData({ ...itemData, ac: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2 flex items-end">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="requiresAttunement"
                                        checked={itemData.requires_attunement}
                                        onCheckedChange={(checked) => setItemData({ ...itemData, requires_attunement: !!checked })}
                                    />
                                    <Label htmlFor="requiresAttunement" className="cursor-pointer">Requires Attunement</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 border-t border-primary/20 pt-4">
                        <Button type="button" variant="outline" onClick={close} className="border-primary/30">Cancel</Button>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">
                            <Check className="mr-2 h-4 w-4" />
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ItemForm