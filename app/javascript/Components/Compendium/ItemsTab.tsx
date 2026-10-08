import React, { useEffect, useRef, useState } from "react";
import { Button, Input } from "../ui";
import { ItemForm } from "../Items";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";
import { Client, IItemType } from "../../Api";
import { cn } from "../../lib/utils";
import { Search } from "lucide-react";

const cols = "grid grid-cols-[2.2fr_1.2fr_1fr_0.6fr_0.8fr] gap-3";

const ItemsTab = ({
  onSelect,
  selectedId,
}: {
  onSelect?: (i: IItemType) => void;
  selectedId?: number | null;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<IItemType[]>([]);
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchItems = () => {
    setLoading(true);
    const path = search ? `/items?name=${search}` : "/items";
    client
      .get({ path, token: auth.getToken() })
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => errors.setError(error));
  };

  useEffect(() => {
    fetchItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isOpen) fetchItems();
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(fetchItems, 300);
  };

  return (
    <div className="flex min-h-0 flex-grow flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="relative min-w-[200px] flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search items…"
            value={search}
            onChange={onSearch}
            className="min-h-[40px] pl-9"
            disabled={loading}
          />
        </div>
        <Button onClick={() => setIsOpen(true)} className="min-h-[40px]">
          Add item
        </Button>
      </div>

      <div className="flex min-h-0 flex-grow flex-col overflow-hidden rounded-2xl border border-border bg-card">
        <div className={`${cols} border-b border-hairline px-[14px] py-3`}>
          {["Name", "Type", "Quality", "Qty", "Attune"].map((h) => (
            <span
              key={h}
              className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
            >
              {h}
            </span>
          ))}
        </div>
        <div className="min-h-0 flex-grow overflow-y-auto">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect?.(item)}
              className={cn(
                `${cols} w-full items-center px-[14px] py-[12px] text-left`,
                selectedId === item.id
                  ? "bg-proficiency-soft"
                  : "odd:bg-secondary",
              )}
            >
              <span className="text-[14px] font-semibold">{item.name}</span>
              <span className="text-[13px] text-foreground-2">
                {item.item_type}
              </span>
              <span className="text-[13px] text-foreground-2">
                {item.quality}
              </span>
              <span className="font-mono text-[13px]">
                {item.quantity ?? 1}
              </span>
              <span className="text-[13px] text-foreground-2">
                {item.requires_attunement ? "yes" : "—"}
              </span>
            </button>
          ))}
          {items.length === 0 && (
            <p className="py-10 text-center text-[13px] text-muted-foreground">
              No items.
            </p>
          )}
        </div>
      </div>

      <ItemForm open={isOpen} close={() => setIsOpen(false)} />
    </div>
  );
};

export default ItemsTab;
