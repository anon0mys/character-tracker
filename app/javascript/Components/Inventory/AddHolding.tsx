import React, { useEffect, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Client, HolderType, IItemType } from "../../Api";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input } from "../ui";

interface AddHoldingProps {
  open: boolean;
  onClose: () => void;
  gameId: number;
  /** Who gets it; omit for "not placed". */
  holder?: { type: HolderType; id: number; name: string };
  onAdded: () => void;
}

/** Search the compendium and file one copy of the pick with a holder. */
const AddHolding = ({
  open,
  onClose,
  gameId,
  holder,
  onAdded,
}: AddHoldingProps) => {
  const [items, setItems] = useState<IItemType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchItems = (name: string) => {
    setLoading(true);
    const path = name ? `/items?name=${encodeURIComponent(name)}` : "/items";
    client
      .get({ path, token: auth.getToken() })
      .then((res) => {
        setItems(res.data ?? []);
        setLoading(false);
      })
      .catch((e) => errors.setError(e));
  };

  useEffect(() => {
    if (open) fetchItems(search);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fetchItems(e.target.value), 300);
  };

  const add = (item: IItemType) =>
    client
      .post({
        path: `/games/${gameId}/holdings`,
        payload: {
          holding: { item_id: item.id, quantity: 1 },
          holder_type: holder?.type,
          holder_id: holder?.id,
        },
        token: auth.getToken(),
        successMessage: `${item.name} added`,
      })
      .then(() => {
        onAdded();
        onClose();
      })
      .catch((e) => errors.setError(e));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-3">
        <DialogHeader>
          <DialogTitle className="font-display">
            {holder ? `Give ${holder.name} an item` : "Add an item"}
          </DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Search items…"
            value={search}
            onChange={onSearch}
            className="min-h-[40px] pl-9"
          />
        </div>
        <div className="min-h-0 flex-grow overflow-y-auto rounded-xl border border-border">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => add(item)}
                className="flex w-full flex-col gap-[2px] border-b border-hairline px-3 py-2 text-left last:border-b-0 hover:bg-secondary"
              >
                <span className="text-[14px] font-semibold">{item.name}</span>
                <span className="text-[12px] text-muted-foreground">
                  {[item.item_type, item.homebrew ? "homebrew" : item.source]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </button>
            ))
          )}
          {!loading && items.length === 0 && (
            <p className="py-10 text-center text-[13px] text-muted-foreground">
              No items match.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddHolding;
