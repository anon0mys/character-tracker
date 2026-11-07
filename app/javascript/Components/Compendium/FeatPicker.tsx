import React, { useEffect, useRef, useState } from "react";
import { Client, IFeatType } from "../../Api";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input } from "../ui";
import { Search, Loader2 } from "lucide-react";

interface FeatPickerProps {
  open: boolean;
  onClose: () => void;
  onPick: (feat: IFeatType) => void;
}

/** Search the feats compendium and hand one back to the caller. */
const FeatPicker = ({ open, onClose, onPick }: FeatPickerProps) => {
  const [feats, setFeats] = useState<IFeatType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchFeats = (name: string) => {
    setLoading(true);
    const path = name ? `/feats?name=${name}` : "/feats";
    client
      .get({ path, token: auth.getToken() })
      .then((res) => {
        setFeats(res.data ?? []);
        setLoading(false);
      })
      .catch((e) => errors.setError(e));
  };

  useEffect(() => {
    if (open) fetchFeats(search);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fetchFeats(e.target.value), 300);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-3">
        <DialogHeader>
          <DialogTitle className="font-display">Add a feat</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Search feats…"
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
            feats.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onPick(f)}
                className="flex w-full flex-col gap-[2px] border-b border-hairline px-3 py-2 text-left last:border-b-0 hover:bg-secondary"
              >
                <span className="text-[14px] font-semibold">{f.name}</span>
                <span className="text-[12px] text-muted-foreground">
                  {f.prerequisite
                    ? `Prerequisite: ${f.prerequisite}`
                    : f.source}
                </span>
              </button>
            ))
          )}
          {!loading && feats.length === 0 && (
            <p className="py-10 text-center text-[13px] text-muted-foreground">
              No feats match.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatPicker;
