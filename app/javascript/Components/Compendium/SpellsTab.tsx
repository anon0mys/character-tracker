import React, { useEffect, useState } from "react";
import { useAuth } from "../../Auth";
import { Client, ISpellType, IPaginationType } from "../../Api";
import { useError } from "../../Errors";
import { archetypes, spellLevels, schools } from "../../Api";
import useFilter from "../../Hooks/useFilter";
import { Button, Input } from "../ui";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "../ui";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const cols = "grid grid-cols-[2.4fr_0.6fr_1.2fr_1fr_1fr_0.8fr] gap-3";
const isConc = (s: ISpellType) =>
  (s.duration || "").toLowerCase().includes("concentration");
const levelLabel = (l: string) =>
  !l || l.toLowerCase() === "cantrip" || l === "0" ? "C" : l;

interface SpellsTabProps {
  onSelect: (spell: ISpellType) => void;
  selectedId?: number | null;
}

const SpellsTab = ({ onSelect, selectedId }: SpellsTabProps) => {
  const [spells, setSpells] = useState<ISpellType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<IPaginationType>({
    data: [],
    pages: 0,
  });
  const [search, setSearch] = useState("");
  const [archetypeFilters, archetypeMenuItems] = useFilter(
    archetypes,
    "spellFilters_archetype",
  );
  const [levelFilters, levelMenuItems] = useFilter(
    spellLevels,
    "spellFilters_level",
  );
  const [schoolFilters, schoolMenuItems] = useFilter(
    schools,
    "spellFilters_school",
  );
  const auth = useAuth();
  const client = Client();
  const errors = useError();

  const fetchSpells = (page = 1) => {
    setLoading(true);
    let path = `/spells?page=${page}`;
    if (search) path += `&name=${search}`;
    if (archetypeFilters.length)
      path += `&archetype=${archetypeFilters.join(",")}`;
    if (levelFilters.length) path += `&level=${levelFilters.join(",")}`;
    if (schoolFilters.length) path += `&school=${schoolFilters.join(",")}`;
    client
      .get({ path, token: auth.getToken() })
      .then((response) => {
        const { data, ...rest } = response;
        setSpells(data);
        setPagination(rest);
        setLoading(false);
      })
      .catch((error) => errors.setError(error));
  };

  useEffect(() => {
    fetchSpells();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, archetypeFilters, schoolFilters, levelFilters]);

  const totalPages = pagination.pages || 0;
  const page = pagination.page || 1;

  return (
    <div className="flex min-h-0 flex-grow flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search spells…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-h-[40px] pl-9 pr-9"
          />
          {search && (
            <X
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-muted-foreground"
              onClick={() => setSearch("")}
            />
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-h-[40px]">
              Class
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>{archetypeMenuItems}</DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-h-[40px]">
              Level
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>{levelMenuItems}</DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-h-[40px]">
              School
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>{schoolMenuItems}</DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex min-h-0 flex-grow flex-col overflow-hidden rounded-2xl border border-border bg-card">
        <div className={`${cols} border-b border-hairline px-[14px] py-3`}>
          {["Name", "Lvl", "School", "Cast", "Range", "Conc."].map((h) => (
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
            {spells.map((spell) => (
              <button
                key={spell.id}
                type="button"
                onClick={() => onSelect(spell)}
                className={cn(
                  `${cols} w-full items-center px-[14px] py-[13px] text-left`,
                  selectedId === spell.id
                    ? "bg-proficiency-soft"
                    : "hover:bg-secondary",
                )}
              >
                <span className="text-[14px] font-semibold">{spell.name}</span>
                <span className="font-mono text-[13px]">
                  {levelLabel(spell.level)}
                </span>
                <span className="text-[13px] text-foreground-2">
                  {spell.school}
                </span>
                <span className="font-mono text-[13px] text-foreground-2">
                  {spell.casting_time}
                </span>
                <span className="font-mono text-[13px] text-foreground-2">
                  {spell.range}
                </span>
                <span
                  className={cn(
                    "text-[13px]",
                    isConc(spell) ? "text-arcane-ink" : "text-muted-foreground",
                  )}
                >
                  {isConc(spell) ? "yes" : "—"}
                </span>
              </button>
            ))}
            {spells.length === 0 && (
              <p className="py-10 text-center text-[13px] text-muted-foreground">
                No spells match.
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
            onClick={() => fetchSpells(page - 1)}
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
            onClick={() => fetchSpells(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default SpellsTab;
