import React, { useEffect, useRef, useState } from "react";
import { Button, Input } from "../ui";
import { ItemForm } from "../Items";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";
import { Client, IItemType } from "../../Api";
import { cn } from "../../lib/utils";
import { Search, X } from "lucide-react";

const cols =
  "grid grid-cols-[2.2fr_1fr_1.4fr] gap-3 lg:grid-cols-[2.2fr_1fr_1fr_1.4fr_1.4fr]";

type SourceFilter = "all" | "published" | "homebrew";

const SOURCES: { key: SourceFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "homebrew", label: "Homebrew" },
];

export const HomebrewBadge = () => (
  <span className="rounded-[4px] bg-proficiency px-[6px] py-[2px] font-mono text-[9.5px] uppercase tracking-[0.08em] text-primary-foreground">
    HB
  </span>
);

const query = (search: string, source: SourceFilter, tag: string | null) => {
  const params = new URLSearchParams();
  if (search) params.set("name", search);
  if (source !== "all") params.set("homebrew", String(source === "homebrew"));
  if (tag) params.set("tag", tag);
  const qs = params.toString();
  return qs ? `/items?${qs}` : "/items";
};

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
  const [source, setSource] = useState<SourceFilter>("all");
  const [tag, setTag] = useState<string | null>(null);
  const [items, setItems] = useState<IItemType[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchItems = (name = search) => {
    setLoading(true);
    client
      .get({ path: query(name, source, tag), token: auth.getToken() })
      .then((response) => {
        setItems(response.data);
        setCount(response.count ?? null);
        setLoading(false);
      })
      .catch((error) => errors.setError(error));
  };

  useEffect(() => {
    if (!isOpen) fetchItems();
  }, [isOpen, source, tag]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fetchItems(e.target.value), 300);
  };

  return (
    <div className="flex min-h-0 flex-grow flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search items…"
            value={search}
            onChange={onSearch}
            className="min-h-[40px] pl-9"
          />
        </div>
        <Button onClick={() => setIsOpen(true)} className="min-h-[40px]">
          Add homebrew item
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div
          role="radiogroup"
          aria-label="Source"
          className="flex rounded-full border border-border bg-card p-[3px]"
        >
          {SOURCES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={source === key}
              onClick={() => setSource(key)}
              className={cn(
                "min-h-[34px] rounded-full px-[13px] text-[13px]",
                source === key
                  ? "bg-proficiency font-semibold text-primary-foreground"
                  : "text-foreground-2",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {tag && (
          <button
            type="button"
            onClick={() => setTag(null)}
            aria-label={`Clear tag ${tag}`}
            className="flex min-h-[38px] items-center gap-[6px] rounded-full border border-proficiency-soft bg-proficiency-soft px-[14px] text-[13px] text-proficiency-ink"
          >
            Tag: {tag}
            <X className="h-[13px] w-[13px]" />
          </button>
        )}
        {count !== null && (
          <span className="ml-auto font-mono text-[12px] text-muted-foreground">
            {count} results
          </span>
        )}
      </div>

      <div className="flex min-h-0 flex-grow flex-col overflow-hidden rounded-2xl border border-border bg-card">
        <div className={`${cols} border-b border-hairline px-[14px] py-3`}>
          {["Name", "Type", "Rarity", "Source", "Tags"].map((h) => (
            <span
              key={h}
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground",
                (h === "Rarity" || h === "Tags") && "hidden lg:block",
              )}
            >
              {h}
            </span>
          ))}
        </div>
        <div className="min-h-0 flex-grow overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                `${cols} w-full items-center px-[14px] py-[12px]`,
                selectedId === item.id
                  ? "bg-proficiency-soft"
                  : "odd:bg-secondary",
              )}
            >
              <button
                type="button"
                onClick={() => onSelect?.(item)}
                className="text-left text-[14px] font-semibold"
              >
                {item.name}
              </button>
              <span className="text-[13px] text-foreground-2">
                {item.item_type}
              </span>
              <span className="hidden text-[13px] text-foreground-2 lg:block">
                {item.quality?.replace(/_/g, " ") || "—"}
              </span>
              <span className="flex min-w-0 items-center gap-[6px] text-[13px] text-foreground-2">
                {item.homebrew && <HomebrewBadge />}
                <span className="truncate">{item.source || "—"}</span>
              </span>
              <span className="hidden flex-wrap gap-1 lg:flex">
                {(item.tags ?? []).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTag(t)}
                    className="rounded-full border border-proficiency-soft bg-card px-[9px] py-[3px] text-[12px] text-proficiency-ink"
                  >
                    {t}
                  </button>
                ))}
                {(item.tags ?? []).length === 0 && (
                  <span className="text-[13px] text-muted-foreground">—</span>
                )}
              </span>
            </div>
          ))}
          {!loading && items.length === 0 && (
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
