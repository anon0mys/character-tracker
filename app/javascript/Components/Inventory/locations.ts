import { ILocationType } from "../../Api";

export interface TreeRow {
  location: ILocationType;
  depth: number;
}

const byName = (a: ILocationType, b: ILocationType) =>
  a.name.localeCompare(b.name);

/** The places directly inside a place (null for the top level). */
export const childrenOf = (
  locations: ILocationType[],
  parentId: number | null,
) => locations.filter((l) => l.parent_id === parentId).sort(byName);

/** Every place in tree order, each with how deep it sits. */
export const locationTree = (locations: ILocationType[]): TreeRow[] => {
  const walk = (parentId: number | null, depth: number): TreeRow[] =>
    childrenOf(locations, parentId).flatMap((location) => [
      { location, depth },
      ...walk(location.id, depth + 1),
    ]);
  return walk(null, 0);
};

/** The ids of every place inside a place, however deep. */
export const descendantIds = (
  locations: ILocationType[],
  id: number,
): number[] =>
  childrenOf(locations, id).flatMap((child) => [
    child.id,
    ...descendantIds(locations, child.id),
  ]);

/** The places from the top level down to this one, inclusive. */
export const breadcrumb = (
  locations: ILocationType[],
  location: ILocationType,
): ILocationType[] => {
  const parent = locations.find((l) => l.id === location.parent_id);
  return parent ? [...breadcrumb(locations, parent), location] : [location];
};

/** Tree rows whose name matches, plus their ancestors so the match has context. */
export const searchTree = (
  locations: ILocationType[],
  needle: string,
): TreeRow[] => {
  const rows = locationTree(locations);
  if (!needle) return rows;
  const keep = new Set<number>();
  locations
    .filter((l) => l.name.toLowerCase().includes(needle))
    .forEach((l) => breadcrumb(locations, l).forEach((a) => keep.add(a.id)));
  return rows.filter((r) => keep.has(r.location.id));
};
