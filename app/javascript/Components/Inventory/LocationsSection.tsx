import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Client, ILocationType, INpcType } from "../../Api";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";
import { cn } from "../../lib/utils";
import { initials } from "../Shell";
import AddHolding from "./AddHolding";
import DeleteLocation from "./DeleteLocation";
import HoldingDetail from "./HoldingDetail";
import LocationForm from "./LocationForm";
import MoveHolding from "./MoveHolding";
import { STATUS_CHIP, heldBy, isGone } from "./holdings";
import { breadcrumb, childrenOf, searchTree } from "./locations";
import { useCampaignHoldings } from "./useCampaignHoldings";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type Panel =
  | { mode: "location" }
  | { mode: "detail"; id: number }
  | { mode: "move"; holdingId: number };

const LocationsSection = ({ gameId }: { gameId: number }) => {
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const token = auth.getToken();
  const { holdings, reload } = useCampaignHoldings(gameId);
  const [locations, setLocations] = useState<ILocationType[]>([]);
  const [npcs, setNpcs] = useState<INpcType[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Partial<ILocationType> | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [storing, setStoring] = useState(false);
  const [panel, setPanel] = useState<Panel>({ mode: "location" });

  const loadLocations = () =>
    client
      .get({ path: `/games/${gameId}/locations`, token })
      .then((r) => {
        const rows: ILocationType[] = r.data ?? [];
        setLocations(rows);
        setSelectedId(
          (id) => id ?? childrenOf(rows, null)[0]?.id ?? rows[0]?.id ?? null,
        );
      })
      .catch((e) => errors.setError(e));

  const loadNpcs = () =>
    client
      .get({ path: `/games/${gameId}/npcs`, token })
      .then((r) => setNpcs(r.data ?? []))
      .catch((e) => errors.setError(e));

  useEffect(() => {
    loadLocations();
    loadNpcs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  const select = (id: number) => {
    setSelectedId(id);
    setPanel({ mode: "location" });
  };

  const save = (attrs: Partial<ILocationType>) => {
    const payload = {
      location: {
        name: attrs.name,
        description: attrs.description,
        location_type: attrs.location_type,
        parent_id: attrs.parent_id ?? null,
      },
    };
    const request = attrs.id
      ? client.patch({
          path: `/games/${gameId}/locations/${attrs.id}`,
          payload,
          token,
        })
      : client.post({ path: `/games/${gameId}/locations`, payload, token });
    request
      .then((r) => {
        setEditing(null);
        setSelectedId(r.data.id);
        loadLocations();
      })
      .catch((e) => errors.setError(e));
  };

  const remove = (target: ILocationType, childrenTo: string) =>
    client
      .destroy({
        path: `/games/${gameId}/locations/${target.id}?children_to=${childrenTo}`,
        token,
      })
      .then(() => {
        setDeleting(false);
        setSelectedId(target.parent_id);
        loadLocations();
        loadNpcs();
        reload();
      })
      .catch((e) => errors.setError(e));

  const needle = query.trim().toLowerCase();
  const rows = searchTree(locations, needle);
  const location = locations.find((l) => l.id === selectedId) ?? null;
  const trail = location ? breadcrumb(locations, location) : [];
  const inside = location ? childrenOf(locations, location.id) : [];
  const people = location
    ? npcs.filter((n) => n.location_id === location.id)
    : [];
  const stored = location
    ? heldBy(holdings, "Location", location.id).filter((h) => !isGone(h))
    : [];
  const moving =
    panel.mode === "move"
      ? holdings.find((h) => h.id === panel.holdingId)
      : undefined;

  return (
    <div className="flex min-h-0 flex-col gap-[18px] lg:flex-row">
      <section
        aria-label="Places in this campaign"
        className={cn(
          "w-full flex-shrink-0 flex-col gap-[10px] self-start rounded-[14px] border border-border bg-card p-3 lg:flex lg:w-[360px]",
          location ? "hidden" : "flex",
        )}
      >
        <div className="flex items-center gap-2">
          <label htmlFor="location-q" className="sr-only">
            Search places
          </label>
          <input
            id="location-q"
            type="search"
            placeholder="Search places"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-11 min-w-0 flex-grow rounded-[10px] border border-border bg-background px-[13px] text-[14px]"
          />
          <button
            type="button"
            onClick={() => setEditing({ location_type: "zone" })}
            className="min-h-11 rounded-[10px] bg-primary px-[14px] text-[14px] font-semibold text-primary-foreground"
          >
            Add place
          </button>
        </div>
        {rows.map(({ location: l, depth }) => (
          <button
            key={l.id}
            type="button"
            onClick={() => select(l.id)}
            style={{ paddingLeft: 10 + depth * 18 }}
            className={cn(
              "flex min-h-[48px] items-center gap-[10px] rounded-[9px] py-2 pr-[10px] text-left",
              l.id === selectedId && "bg-proficiency-soft",
            )}
          >
            <span className="flex flex-grow flex-col gap-[1px]">
              <span className="text-[14px] font-semibold">{l.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {capitalize(l.location_type)}
              </span>
            </span>
            <span className="font-mono text-[12px] text-foreground-2">
              {l.holding_count}
            </span>
          </button>
        ))}
        {locations.length === 0 && (
          <p className="py-6 text-center text-[13px] text-muted-foreground">
            No places yet.
          </p>
        )}
      </section>

      {location && (
        <section
          aria-labelledby="location-h"
          className="flex min-h-[560px] min-w-0 flex-grow flex-col gap-4 rounded-[14px] border border-border-strong bg-card p-[18px] lg:px-[22px] lg:py-5"
        >
          {panel.mode === "detail" && (
            <HoldingDetail
              gameId={gameId}
              holdingId={panel.id}
              onBack={() => setPanel({ mode: "location" })}
              onMove={(h) => setPanel({ mode: "move", holdingId: h.id })}
              onChanged={() => {
                reload();
                loadLocations();
              }}
              backLabel={`Back to ${location.name}`}
            />
          )}
          {panel.mode === "move" && moving && (
            <MoveHolding
              gameId={gameId}
              holding={moving}
              holdings={holdings}
              onBack={() => setPanel({ mode: "detail", id: moving.id })}
              onMoved={() => {
                reload();
                loadLocations();
                setPanel({ mode: "location" });
              }}
            />
          )}
          {panel.mode === "location" && (
            <>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="self-start text-[13px] font-medium text-primary lg:hidden"
              >
                All places
              </button>
              {trail.length > 1 && (
                <nav
                  aria-label="Where this place is"
                  className="flex flex-wrap items-center gap-1 text-[13px] text-foreground-2"
                >
                  {trail.slice(0, -1).map((a) => (
                    <React.Fragment key={a.id}>
                      <button
                        type="button"
                        onClick={() => select(a.id)}
                        className="font-medium text-primary"
                      >
                        {a.name}
                      </button>
                      <ChevronRight
                        className="h-3 w-3 text-muted-foreground"
                        aria-hidden
                      />
                    </React.Fragment>
                  ))}
                  <span>{location.name}</span>
                </nav>
              )}
              <div className="flex items-start gap-[14px]">
                <div className="flex flex-grow flex-col gap-1">
                  <h2
                    id="location-h"
                    className="font-display text-[30px] font-semibold leading-[1.05]"
                  >
                    {location.name}
                  </h2>
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    {location.location_type}
                  </span>
                  {location.description && (
                    <span className="text-[14px] italic text-foreground-2">
                      {location.description}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setEditing(location)}
                  className="min-h-11 whitespace-nowrap rounded-[10px] border border-border-strong bg-secondary px-4 text-[14px] font-medium"
                >
                  Edit place
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(true)}
                  className="min-h-11 whitespace-nowrap rounded-[10px] border border-border-strong px-4 text-[14px] font-medium text-harm"
                >
                  Delete
                </button>
              </div>

              <div className="grid gap-[9px] lg:grid-cols-2">
                <div className="flex flex-col gap-[2px] rounded-[10px] bg-secondary px-3 py-[10px]">
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                    Places inside · {inside.length}
                  </span>
                  {inside.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => select(c.id)}
                      className="min-h-9 text-left text-[14px] font-semibold text-primary"
                    >
                      {c.name}
                    </button>
                  ))}
                  {inside.length === 0 && (
                    <span className="text-[14px] text-muted-foreground">
                      none
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-[2px] rounded-[10px] bg-secondary px-3 py-[10px]">
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                    NPCs here · {people.length}
                  </span>
                  {people.map((n) => (
                    <span
                      key={n.id}
                      className="flex min-h-9 items-center gap-2 text-[14px] font-semibold"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background font-mono text-[9px] text-foreground-2">
                        {initials(n.name)}
                      </span>
                      {n.name}
                    </span>
                  ))}
                  {people.length === 0 && (
                    <span className="text-[14px] text-muted-foreground">
                      none
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-[10px]">
                <h3 className="font-display text-[20px] font-semibold">
                  Stored here
                </h3>
                <span className="font-mono text-[12px] text-muted-foreground">
                  {stored.length} holdings
                </span>
                <button
                  type="button"
                  onClick={() => setStoring(true)}
                  className="ml-auto min-h-9 rounded-full border border-border-strong px-[13px] text-[12.5px] text-foreground-2"
                >
                  Store item
                </button>
              </div>
              <div className="flex min-h-0 flex-grow flex-col gap-[2px] overflow-y-auto pr-1">
                {stored.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setPanel({ mode: "detail", id: h.id })}
                    className="grid grid-cols-[2.2fr_0.5fr_0.9fr] items-center gap-3 rounded-[9px] px-3 py-[10px] text-left hover:bg-secondary lg:grid-cols-[2.2fr_0.5fr_0.9fr_2.6fr]"
                  >
                    <span
                      className={cn(
                        "text-[14px] font-medium",
                        h.quantity === 0 && "text-muted-foreground",
                      )}
                    >
                      {h.item.name}{" "}
                      {h.item.homebrew && (
                        <span className="font-mono text-[10px] text-proficiency-ink">
                          HB
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-[12px] text-foreground-2">
                      {h.quantity}
                    </span>
                    <span
                      className={cn(
                        "justify-self-start rounded-full px-2 py-[3px] font-mono text-[11px]",
                        STATUS_CHIP[h.status],
                      )}
                    >
                      {h.status}
                    </span>
                    <span className="hidden truncate text-[13px] text-foreground-2 lg:block">
                      {h.quantity === 0 ? "none left" : (h.notes ?? "—")}
                    </span>
                  </button>
                ))}
                {stored.length === 0 && (
                  <p className="py-6 text-center text-[13px] text-muted-foreground">
                    Nothing is stored at {location.name}.
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      )}

      <LocationForm
        location={editing}
        locations={locations}
        open={editing !== null}
        onClose={() => setEditing(null)}
        onSave={save}
      />
      {location && (
        <>
          <DeleteLocation
            location={location}
            locations={locations}
            open={deleting}
            onClose={() => setDeleting(false)}
            onDelete={(childrenTo) => remove(location, childrenTo)}
          />
          <AddHolding
            open={storing}
            onClose={() => setStoring(false)}
            gameId={gameId}
            holder={{ type: "Location", id: location.id, name: location.name }}
            onAdded={() => {
              reload();
              loadLocations();
            }}
          />
        </>
      )}
    </div>
  );
};

export default LocationsSection;
