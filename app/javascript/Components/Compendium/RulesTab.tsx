import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Client, IRuleType } from "../../Api";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";
import { Input } from "../ui";
import { cn } from "../../lib/utils";

interface RulesTabProps {
  onSelect: (rule: IRuleType) => void;
  selectedId?: number | null;
  /** Called once the rules arrive, e.g. to open the first one on desktop. */
  onLoad?: (rules: IRuleType[]) => void;
}

/** The rules by chapter. Search matches names and the rules text. */
const RulesTab = ({ onSelect, selectedId, onLoad }: RulesTabProps) => {
  const [rules, setRules] = useState<IRuleType[] | null>(null);
  const [search, setSearch] = useState("");
  const auth = useAuth();
  const errors = useError();

  useEffect(() => {
    Client()
      .get({ path: "/rules", token: auth.getToken() })
      .then((res) => {
        setRules(res.data ?? []);
        onLoad?.(res.data ?? []);
      })
      .catch((e) => errors.setError(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chapters = useMemo(() => {
    const query = search.trim().toLowerCase();
    const groups: { category: string; rules: IRuleType[] }[] = [];
    (rules ?? [])
      .filter(
        (rule) =>
          !query ||
          rule.name.toLowerCase().includes(query) ||
          rule.body.toLowerCase().includes(query),
      )
      .forEach((rule) => {
        const last = groups[groups.length - 1];
        if (last?.category === rule.category) last.rules.push(rule);
        else groups.push({ category: rule.category, rules: [rule] });
      });
    return groups;
  }, [rules, search]);

  return (
    <div className="flex min-h-0 w-full flex-col gap-3 lg:w-[300px] lg:flex-shrink-0">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search rules… (e.g. grapple, cover)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-[40px] pl-9"
        />
      </div>
      <div className="flex min-h-0 flex-grow flex-col overflow-y-auto rounded-2xl border border-border bg-card py-2 lg:max-h-[calc(100vh-220px)]">
        {rules === null ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : chapters.length === 0 ? (
          <p className="py-10 text-center text-[13px] text-muted-foreground">
            No rules match “{search}”.
          </p>
        ) : (
          chapters.map(({ category, rules: inChapter }) => (
            <section key={category} className="flex flex-col py-1">
              <h3 className="px-[14px] pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                {category}
              </h3>
              {inChapter.map((rule) => (
                <button
                  key={rule.id}
                  type="button"
                  onClick={() => onSelect(rule)}
                  className={cn(
                    "min-h-[40px] px-[14px] py-2 text-left text-[14px]",
                    selectedId === rule.id
                      ? "bg-proficiency-soft font-semibold"
                      : "hover:bg-secondary",
                  )}
                >
                  {rule.name}
                </button>
              ))}
            </section>
          ))
        )}
      </div>
    </div>
  );
};

export default RulesTab;
