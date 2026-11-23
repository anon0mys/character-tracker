import { useEffect, useId, useRef } from "react";

/** Where open overlays note themselves in history.state. */
const KEY = "__overlays";
const overlays = (): string[] =>
  (window.history.state?.[KEY] as string[] | undefined) ?? [];

/**
 * While `open`, the overlay has its own history entry, so the browser's Back
 * (or a phone's back gesture) closes it instead of leaving the page. Closing
 * it any other way removes that entry again. The URL never changes, and the
 * router never sees these entries.
 */
const useBackToClose = (open: boolean, close: () => void) => {
  const id = useId();
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    if (!open) return;
    window.history.pushState(
      { ...window.history.state, [KEY]: [...overlays(), id] },
      "",
    );
    const onPop = () => {
      if (!overlays().includes(id)) closeRef.current();
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      // Closed from the UI: drop our entry if it's still the current one. (If
      // something navigated away meanwhile, leave history alone.)
      const stack = overlays();
      if (stack[stack.length - 1] === id) window.history.back();
    };
  }, [open, id]);
};

export default useBackToClose;
