import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Check } from "lucide-react";
import { Client, IItemType, item_types, qualities } from "../../Api";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";

interface ItemFormProps {
  item?: IItemType;
  open: boolean;
  close: VoidFunction;
  initialName?: string;
  onSaved?: (item: IItemType) => void;
}

const ItemForm = ({
  item,
  open,
  close,
  initialName,
  onSaved,
}: ItemFormProps) => {
  const [itemData, setItemData] = useState<IItemType>({
    name: initialName ?? "",
    description: "",
    item_type: "",
    quality: "",
    potential_damage: 0,
    total_charges: 0,
    value: 0,
    requires_attunement: false,
    ac: 0,
    stat_bonuses: {},
    source: "",
    homebrew: true,
    tags: [],
  });
  const [tagText, setTagText] = useState((item?.tags ?? []).join(", "));
  const auth = useAuth();
  const client = Client();
  const errors = useError();

  useEffect(() => {
    item && setItemData(item);
  }, []);

  const makeRequest = () => {
    var path = "/items";
    const payload = {
      ...itemData,
      tags: tagText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (itemData.id) {
      path += `/${itemData.id}`;
      return client.patch({
        path: path,
        token: auth.getToken(),
        payload,
      });
    } else {
      return client.post({
        path: path,
        token: auth.getToken(),
        payload,
      });
    }
  };

  const submit = () => {
    makeRequest()
      .then((response) => {
        console.log("probably add a banner indicating success here");
        onSaved?.(response.data);
        close();
      })
      .catch((error) => errors.setError(error));
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-border bg-card ">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {item ? "Edit Item" : "Add Item"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={itemData.name}
                placeholder="Item name"
                onChange={(e) =>
                  setItemData({ ...itemData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={itemData.description}
                placeholder="Item description"
                onChange={(e) =>
                  setItemData({ ...itemData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemType">Item Type</Label>
              <Select
                value={itemData.item_type}
                onValueChange={(value) =>
                  setItemData({ ...itemData, item_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  {item_types.map((item_type) => (
                    <SelectItem key={item_type} value={item_type}>
                      {item_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={itemData.source ?? ""}
                  placeholder="Book or campaign"
                  onChange={(e) =>
                    setItemData({ ...itemData, source: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tagText}
                  placeholder="magic item, gadget"
                  onChange={(e) => setTagText(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="homebrew"
                checked={!!itemData.homebrew}
                onCheckedChange={(checked) =>
                  setItemData({ ...itemData, homebrew: !!checked })
                }
              />
              <Label htmlFor="homebrew" className="cursor-pointer">
                Homebrew
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality">Quality</Label>
              <Select
                value={itemData.quality}
                onValueChange={(value) =>
                  setItemData({ ...itemData, quality: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select item quality" />
                </SelectTrigger>
                <SelectContent>
                  {qualities.map((quality) => (
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
                  onChange={(e) =>
                    setItemData({
                      ...itemData,
                      potential_damage: parseInt(e.target.value) || 0,
                    })
                  }
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
                  onChange={(e) =>
                    setItemData({
                      ...itemData,
                      total_charges: parseInt(e.target.value) || 0,
                    })
                  }
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
                  onChange={(e) =>
                    setItemData({
                      ...itemData,
                      value: parseInt(e.target.value) || 0,
                    })
                  }
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
                  onChange={(e) =>
                    setItemData({
                      ...itemData,
                      ac: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2 flex items-end">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresAttunement"
                    checked={itemData.requires_attunement}
                    onCheckedChange={(checked) =>
                      setItemData({
                        ...itemData,
                        requires_attunement: !!checked,
                      })
                    }
                  />
                  <Label
                    htmlFor="requiresAttunement"
                    className="cursor-pointer"
                  >
                    Requires Attunement
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={close}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 "
            >
              <Check className="mr-2 h-4 w-4" />
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemForm;
