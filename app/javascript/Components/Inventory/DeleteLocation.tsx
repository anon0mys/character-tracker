import React, { useEffect, useState } from "react";
import { ILocationType } from "../../Api";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui";
import { descendantIds, locationTree } from "./locations";

const TOP_LEVEL = "top";
const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

/**
 * Confirm deleting a place. Items here become unplaced and NPCs here have no
 * location; only the places inside need somewhere to go (the parent by default).
 */
const DeleteLocation = ({
  location,
  locations,
  open,
  onClose,
  onDelete,
}: {
  location: ILocationType;
  locations: ILocationType[];
  open: boolean;
  onClose: () => void;
  onDelete: (childrenTo: string) => void;
}) => {
  const fallback = location.parent_id ? String(location.parent_id) : TOP_LEVEL;
  const [childrenTo, setChildrenTo] = useState(fallback);
  useEffect(() => setChildrenTo(fallback), [fallback, open]);

  const excluded = [location.id, ...descendantIds(locations, location.id)];
  const destinations = locationTree(locations).filter(
    (r) => !excluded.includes(r.location.id),
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="font-display">
            Delete {location.name}?
          </DialogTitle>
        </DialogHeader>
        <ul className="flex flex-col gap-1 text-[14px] text-foreground-2">
          {location.holding_count > 0 && (
            <li>
              <span className="font-mono">
                {plural(location.holding_count, "item", "items")}
              </span>{" "}
              here become unplaced.
            </li>
          )}
          {location.npc_count > 0 && (
            <li>
              <span className="font-mono">
                {plural(location.npc_count, "NPC", "NPCs")}
              </span>{" "}
              here will have no location.
            </li>
          )}
        </ul>
        {location.child_count > 0 && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="children-to">
              The{" "}
              <span className="font-mono">
                {plural(location.child_count, "place", "places")}
              </span>{" "}
              inside move to
            </Label>
            <Select value={childrenTo} onValueChange={setChildrenTo}>
              <SelectTrigger id="children-to">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TOP_LEVEL}>Top level</SelectItem>
                {destinations.map(({ location: l, depth }) => (
                  <SelectItem key={l.id} value={String(l.id)}>
                    {"  ".repeat(depth)}
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => onDelete(childrenTo)}
          >
            Delete {location.name}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteLocation;
