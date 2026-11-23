import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

type Changes = Record<string, string | number | null | undefined>;

/**
 * The record a list is showing (an item, NPC, place, compendium entry) lives
 * in the URL, e.g. ?holding=12, so Back closes it, a link can open it, and the
 * list underneath keeps its place.
 *
 *   const view = useRecordView();
 *   view.params.get("holding")         // what's open
 *   view.open({ holding: 12 })          // open (or switch to) a record
 *   view.push({ move: 1 })              // a step deeper; Back returns here
 *   view.close({ holding: null })       // back out one step (or more)
 *   view.closeAll({ holding: null, move: null })
 *
 * The `changes` given to close/closeAll are only used when the record was
 * opened by a link rather than from the list (nothing to go back to).
 */
const useRecordView = () => {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const depth: number = (location.state as any)?.recordDepth ?? 0;

  const apply = (changes: Changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) =>
      value === null || value === undefined
        ? next.delete(key)
        : next.set(key, String(value)),
    );
    return next;
  };

  const push = (changes: Changes) =>
    setParams(apply(changes), { state: { recordDepth: depth + 1 } });

  return {
    params,
    push,
    /** Opens a record; switching records replaces rather than stacking. */
    open: (changes: Changes) =>
      depth > 0
        ? setParams(apply(changes), {
            replace: true,
            state: { recordDepth: depth },
          })
        : push(changes),
    /** Back out `steps` steps (default one), e.g. 2 from a Move to its place. */
    close: (changes: Changes, steps = 1) =>
      depth >= steps
        ? navigate(-steps)
        : setParams(apply(changes), {
            replace: true,
            state: { recordDepth: Math.max(depth - steps, 0) },
          }),
    closeAll: (changes: Changes) =>
      depth > 0
        ? navigate(-depth)
        : setParams(apply(changes), { replace: true }),
  };
};

export default useRecordView;
