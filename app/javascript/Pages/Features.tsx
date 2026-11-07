import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Client,
  ICharacterType,
  IFeature,
  IFeatType,
  FeatureCategory,
} from "../Api";
import FeatPicker from "../Components/Compendium/FeatPicker";
import { useAuth } from "../Auth";
import { useError } from "../Errors";
import {
  IdentityHeader,
  ReadOnlyBanner,
  ReadOnlyFieldset,
  SheetAccessProvider,
  useIsReadOnly,
} from "../Components/Sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Components/ui";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "../lib/utils";
import { useCharacterPatch } from "../Hooks/useCharacterPatch";

const CATEGORIES: FeatureCategory[] = [
  "class",
  "subclass",
  "infusion",
  "racial",
  "background",
  "feat",
  "item",
  "blessing",
  "other",
];

const CHARACTERISTIC_KEYS = {
  trait: "personality_traits",
  ideal: "ideals",
  bond: "bonds",
  flaw: "flaws",
} as const;

/** Stable React key: feat rows by join id, custom rows by row id, derived rows by position (names can repeat across race and subrace). */
const featureKey = (f: IFeature, index: number): string =>
  f.origin === "feat"
    ? `feat-${f.character_feat_id}`
    : f.id
      ? `custom-${f.id}`
      : `derived-${f.category}-${index}`;

/** Rows of the character's background table for one of trait/ideal/bond/flaw. */
const characteristicTable = (
  character: ICharacterType,
  key: keyof typeof CHARACTERISTIC_KEYS,
): string[] => {
  const rows =
    character.background_details?.characteristics?.[CHARACTERISTIC_KEYS[key]];
  return Array.isArray(rows) ? rows : [];
};

const emptyFeature = (): IFeature => ({
  category: "other",
  name: "",
  description: "",
});

const FeatureForm = ({
  open,
  feature,
  onClose,
  onSave,
}: {
  open: boolean;
  feature: IFeature;
  onClose: () => void;
  onSave: (f: IFeature) => void;
}) => {
  const [draft, setDraft] = useState<IFeature>(feature);
  useEffect(() => setDraft(feature), [feature]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">
            {feature.id ? "Edit feature" : "Add feature"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="Name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <Select
            value={draft.category}
            onValueChange={(v) =>
              setDraft({ ...draft, category: v as FeatureCategory })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c} className="capitalize">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Description"
            value={draft.description ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, description: e.target.value })
            }
            className="min-h-[140px]"
          />
        </div>
        <DialogFooter className="gap-2 border-t border-border pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(draft)} disabled={!draft.name.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Features = () => {
  const { id } = useParams();
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const [character, setCharacter] = useState<ICharacterType>({
    name: "",
  } as ICharacterType);
  const [features, setFeatures] = useState<IFeature[]>([]);
  const { patch } = useCharacterPatch(character, setCharacter);
  const readOnly = useIsReadOnly(character);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<IFeature>(emptyFeature());
  const [filter, setFilter] = useState<FeatureCategory | "all">("all");
  const [featPickerOpen, setFeatPickerOpen] = useState(false);

  const token = auth.getToken();

  useEffect(() => {
    client
      .get({ path: `/characters/${id}`, token })
      .then((r) => setCharacter(r.data))
      .catch((e) => errors.setError(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Derived rows follow class, subclass, race, subrace and level, so refetch
  // once the server has confirmed a character change.
  useEffect(() => {
    if (!character.id) return;
    client
      .get({ path: `/characters/${id}/features`, token })
      .then((r) => setFeatures(r.data ?? []))
      .catch((e) => errors.setError(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, character.id, character.updated_at]);

  const save = (f: IFeature) => {
    const req = { token, payload: { feature: f } };
    const p = f.id
      ? client.patch({ ...req, path: `/characters/${id}/features/${f.id}` })
      : client.post({ ...req, path: `/characters/${id}/features` });
    p.then((r) => {
      setFeatures((prev) => {
        const exists = prev.some((x) => x.id === r.data.id);
        return exists
          ? prev.map((x) => (x.id === r.data.id ? r.data : x))
          : [...prev, r.data];
      });
      setFormOpen(false);
    }).catch((e) => errors.setError(e));
  };

  const remove = (f: IFeature) => {
    client
      .destroy({ path: `/characters/${id}/features/${f.id}`, token })
      .then(() => setFeatures((prev) => prev.filter((x) => x.id !== f.id)))
      .catch((e) => errors.setError(e));
  };

  const addFeat = (feat: IFeatType) => {
    client
      .post({
        path: `/characters/${id}/feats`,
        token,
        payload: { feat_id: feat.id },
      })
      .then((r) => {
        setFeatures((prev) => [...prev, r.data]);
        setFeatPickerOpen(false);
      })
      .catch((e) => errors.setError(e));
  };

  const removeFeat = (f: IFeature) => {
    client
      .destroy({
        path: `/characters/${id}/feats/${f.character_feat_id}`,
        token,
      })
      .then(() =>
        setFeatures((prev) =>
          prev.filter((x) => x.character_feat_id !== f.character_feat_id),
        ),
      )
      .catch((e) => errors.setError(e));
  };

  const openAdd = () => {
    setEditing(emptyFeature());
    setFormOpen(true);
  };
  const openEdit = (f: IFeature) => {
    setEditing(f);
    setFormOpen(true);
  };

  if (!character.id) {
    return <p className="py-10 text-center text-muted-foreground">Loading…</p>;
  }

  const present = CATEGORIES.filter((c) =>
    features.some((f) => f.category === c),
  );
  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    items: features.filter((f) => f.category === cat),
  }))
    .filter((g) => g.items.length > 0)
    .filter((g) => filter === "all" || g.cat === filter);

  return (
    <SheetAccessProvider character={character}>
      <div className="flex flex-col gap-[14px]">
        <IdentityHeader character={character} onRested={setCharacter} />
        <ReadOnlyBanner name={character.name} />

        <ReadOnlyFieldset>
          <div className="grid gap-[14px] rounded-2xl border border-border bg-card p-4 lg:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                {character.subclass_label ?? "Subclass"}
              </label>
              {(character.subclass_options ?? []).length > 0 ? (
                <Select
                  value={character.subclass || undefined}
                  onValueChange={(v) => patch({ subclass: v })}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={`Choose ${character.subclass_label ?? "subclass"}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      new Set([
                        ...(character.subclass ? [character.subclass] : []),
                        ...(character.subclass_options ?? []),
                      ]),
                    ).map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={character.subclass ?? ""}
                  onChange={(e) => patch({ subclass: e.target.value })}
                  placeholder="e.g. Armorer"
                />
              )}
            </div>
            {(character.subclass_details ?? []).find(
              (x) => x.name === character.subclass,
            )?.description && (
              <p className="text-[12.5px] leading-relaxed text-foreground-2 sm:col-span-2">
                {
                  (character.subclass_details ?? []).find(
                    (x) => x.name === character.subclass,
                  )?.description
                }
              </p>
            )}

            {(character.race_details?.subraces ?? []).length > 0 && (
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  Subrace
                </label>
                <Select
                  value={character.subrace || undefined}
                  onValueChange={(v) => patch({ subrace: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose subrace" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      new Set([
                        ...(character.subrace ? [character.subrace] : []),
                        ...(character.race_details?.subraces ?? []),
                      ]),
                    ).map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                Languages
              </label>
              <Input
                value={(character.languages ?? []).join(", ")}
                onChange={(e) =>
                  patch({
                    languages: e.target.value
                      .split(",")
                      .map((l) => l.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="Common, Draconic"
              />
            </div>
            {(
              [
                ["trait", "Personality trait"],
                ["ideal", "Ideal"],
                ["bond", "Bond"],
                ["flaw", "Flaw"],
              ] as const
            ).map(([key, label]) => {
              const table = characteristicTable(character, key);
              return (
                <div key={key} className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {label}
                  </label>
                  <Textarea
                    value={(character[key] as string) ?? ""}
                    onChange={(e) => patch({ [key]: e.target.value })}
                    className="min-h-[64px] bg-secondary"
                  />
                  {table.length > 0 && (
                    <Select value="" onValueChange={(v) => patch({ [key]: v })}>
                      <SelectTrigger className="h-8 text-[12px] text-muted-foreground">
                        <SelectValue
                          placeholder={`Pick from ${character.background} table`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {table.map((row, i) => (
                          <SelectItem key={i} value={row}>
                            {row}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              );
            })}
          </div>
        </ReadOnlyFieldset>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            Features
          </span>
          {!readOnly && (
            <div className="ml-auto flex flex-wrap justify-end gap-2">
              <Button variant="outline" onClick={() => setFeatPickerOpen(true)}>
                Add feat
              </Button>
              <Button onClick={openAdd}>Add feature</Button>
            </div>
          )}
        </div>

        {present.length > 1 && (
          <div className="flex gap-[6px] overflow-x-auto pb-1">
            {(["all", ...present] as (FeatureCategory | "all")[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                className={cn(
                  "min-h-[36px] flex-shrink-0 rounded-full px-4 text-[12.5px] capitalize",
                  filter === c
                    ? "bg-foreground text-background font-semibold"
                    : "border border-border bg-card text-foreground-2",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {byCategory.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            No features yet. Pick a class, race or background, or add one.
          </p>
        ) : (
          <ReadOnlyFieldset>
            <div className="columns-1 gap-[14px] lg:columns-3">
              {byCategory.map(({ cat, items }) => (
                <div
                  key={cat}
                  className="mb-[14px] flex break-inside-avoid flex-col gap-2 rounded-2xl border border-border bg-card p-4"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-proficiency-ink">
                    {cat}
                  </span>
                  {items.map((f, index) => (
                    <div
                      key={featureKey(f, index)}
                      className="group flex flex-col gap-1 border-t border-hairline pt-2 first:border-t-0 first:pt-0"
                    >
                      <div className="flex items-start gap-2">
                        <span className="flex-grow font-display text-[15px] font-semibold">
                          {f.name}
                        </span>
                        {f.origin === "custom" && (
                          <button
                            type="button"
                            aria-label="Edit"
                            onClick={() => openEdit(f)}
                            className="text-muted-foreground opacity-0 group-hover:opacity-100"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {f.origin !== "derived" && (
                          <button
                            type="button"
                            aria-label="Delete"
                            onClick={() =>
                              f.origin === "feat" ? removeFeat(f) : remove(f)
                            }
                            className="text-muted-foreground opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      {f.description && (
                        <p className="text-[12.5px] leading-relaxed text-foreground-2">
                          {f.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ReadOnlyFieldset>
        )}

        <FeatPicker
          open={featPickerOpen}
          onClose={() => setFeatPickerOpen(false)}
          onPick={addFeat}
        />

        <FeatureForm
          open={formOpen}
          feature={editing}
          onClose={() => setFormOpen(false)}
          onSave={save}
        />
      </div>
    </SheetAccessProvider>
  );
};

export default Features;
