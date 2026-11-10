import React, { useEffect, useState } from "react";
import { ILocationType, locationTypes } from "../../Api";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui";
import { descendantIds, locationTree } from "./locations";

const TOP_LEVEL = "top";
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Add or edit a place; the parent picker leaves out the place and anything inside it. */
const LocationForm = ({
  location,
  locations,
  open,
  onClose,
  onSave,
}: {
  location: Partial<ILocationType> | null;
  locations: ILocationType[];
  open: boolean;
  onClose: () => void;
  onSave: (attrs: Partial<ILocationType>) => void;
}) => {
  const [draft, setDraft] = useState<Partial<ILocationType>>(location ?? {});
  useEffect(() => setDraft(location ?? {}), [location]);

  const excluded = location?.id
    ? [location.id, ...descendantIds(locations, location.id)]
    : [];
  const parents = locationTree(locations).filter(
    (r) => !excluded.includes(r.location.id),
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="font-display">
            {location?.id ? `Edit ${location.name}` : "Add a place"}
          </DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(draft);
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="location-name">Name</Label>
            <Input
              id="location-name"
              value={draft.name ?? ""}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="location-type">Type</Label>
              <Select
                value={draft.location_type ?? "zone"}
                onValueChange={(v) => setDraft({ ...draft, location_type: v })}
              >
                <SelectTrigger id="location-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locationTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {capitalize(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="location-parent">Inside</Label>
              <Select
                value={draft.parent_id ? String(draft.parent_id) : TOP_LEVEL}
                onValueChange={(v) =>
                  setDraft({
                    ...draft,
                    parent_id: v === TOP_LEVEL ? null : Number(v),
                  })
                }
              >
                <SelectTrigger id="location-parent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TOP_LEVEL}>Top level</SelectItem>
                  {parents.map(({ location: l, depth }) => (
                    <SelectItem key={l.id} value={String(l.id)}>
                      {"  ".repeat(depth)}
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location-description">Description</Label>
            <Input
              id="location-description"
              value={draft.description ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!draft.name}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LocationForm;
