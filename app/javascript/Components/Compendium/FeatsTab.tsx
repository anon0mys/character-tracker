import React, { useEffect, useRef, useState } from "react";
import { Client, IFeatType, IPaginationType } from "../../Api";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";
import { Input, Button } from "../ui";
import { Search, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const cols = "grid grid-cols-[1.6fr_1.8fr_1.4fr] gap-3";

interface FeatsTabProps {
  onSelect: (f: IFeatType) => void;
  selectedId?: number | null;
}

const FeatsTab = ({ onSelect, selectedId }: FeatsTabProps) => {
  const [feats, setFeats] = useState<IFeatType[]>([]);
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

  const fetchFeats = (page = 1) => {
    setLoading(true);
    let path = `/feats?page=${page}`;
    if (search) path += `&name=${search}`;
    client
      .get({ path, token: auth.getToken() })
      .then((res) => {
        const { data, ...rest } = res;
        setFeats(data);
        setPagination(rest);
        setLoading(false);
      })
      .catch((e) => errors.setError(e));
  };

  useEffect(() => {
    fetchFeats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fetchFeats(1), 300);
  };

  const page = pagination.page || 1;
  const totalPages = pagination.pages || 0;

  return (
    <div className="flex min-h-0 flex-grow flex-col gap-3">
      <div className="relative min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search feats…"
          value={search}
          onChange={onSearch}
          className="min-h-[40px] pl-9"
        />
      </div>

      <div className="flex min-h-0 flex-grow flex-col overflow-hidden rounded-2xl border border-border bg-card">
        <div className={`${cols} border-b border-hairline px-[14px] py-3`}>
          {["Name", "Prerequisite", "Source"].map((h) => (
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
            {feats.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onSelect(f)}
                className={cn(
                  `${cols} w-full items-center px-[14px] py-[12px] text-left`,
                  selectedId === f.id
                    ? "bg-proficiency-soft"
                    : "hover:bg-secondary",
                )}
              >
                <span className="text-[14px] font-semibold">{f.name}</span>
                <span className="truncate text-[13px] text-foreground-2">
                  {f.prerequisite || "—"}
                </span>
                <span className="truncate text-[12px] text-muted-foreground">
                  {f.source}
                </span>
              </button>
            ))}
            {feats.length === 0 && (
              <p className="py-10 text-center text-[13px] text-muted-foreground">
                No feats.
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
            onClick={() => fetchFeats(page - 1)}
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
            onClick={() => fetchFeats(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default FeatsTab;
