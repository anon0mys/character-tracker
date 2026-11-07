import React, { useEffect, useRef, useState } from "react";
import { Client, IRaceType, IPaginationType } from "../../Api";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";
import { Input, Button } from "../ui";
import { Search, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const cols = "grid grid-cols-[2fr_1.1fr_1fr_0.6fr_1.5fr] gap-3";

interface RacesTabProps {
  onSelect: (r: IRaceType) => void;
  selectedId?: number | null;
}

const RacesTab = ({ onSelect, selectedId }: RacesTabProps) => {
  const [races, setRaces] = useState<IRaceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<IPaginationType>({
    data: [],
    pages: 0,
  });
  const [search, setSearch] = useState("");
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchRaces = (page = 1) => {
    setLoading(true);
    let path = `/races?page=${page}`;
    if (search) path += `&name=${search}`;
    client
      .get({ path, token: auth.getToken() })
      .then((res) => {
        const { data, ...rest } = res;
        setRaces(data);
        setPagination(rest);
        setLoading(false);
      })
      .catch((e) => errors.setError(e));
  };

  useEffect(() => {
    fetchRaces();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fetchRaces(1), 300);
  };

  const page = pagination.page || 1;
  const totalPages = pagination.pages || 0;

  return (
    <div className="flex min-h-0 flex-grow flex-col gap-3">
      <div className="relative min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search races…"
          value={search}
          onChange={onSearch}
          className="min-h-[40px] pl-9"
        />
      </div>

      <div className="flex min-h-0 flex-grow flex-col overflow-hidden rounded-2xl border border-border bg-card">
        <div className={`${cols} border-b border-hairline px-[14px] py-3`}>
          {["Name", "Category", "Size", "Speed", "Source"].map((h) => (
            <span
              key={h}
              className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
            >
              {h}
            </span>
          ))}
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : (
          <div className="min-h-0 flex-grow overflow-y-auto">
            {races.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelect(r)}
                className={cn(
                  `${cols} w-full items-center px-[14px] py-[12px] text-left`,
                  selectedId === r.id
                    ? "bg-proficiency-soft"
                    : "hover:bg-secondary",
                )}
              >
                <span className="text-[14px] font-semibold">{r.name}</span>
                <span className="text-[13px] text-foreground-2">
                  {r.category}
                </span>
                <span className="text-[13px] text-foreground-2">{r.size}</span>
                <span className="font-mono text-[13px]">{r.speed}</span>
                <span className="truncate text-[12px] text-muted-foreground">
                  {r.source}
                </span>
              </button>
            ))}
            {races.length === 0 && (
              <p className="py-10 text-center text-[13px] text-muted-foreground">
                No races.
              </p>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => fetchRaces(page - 1)}
          >
            Previous
          </Button>
          <span className="font-mono text-[12px] text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => fetchRaces(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default RacesTab;
