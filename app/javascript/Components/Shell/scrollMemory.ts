import { RefObject, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

/**
 * Scroll like a website should: a new page starts at the top; Back (or
 * Forward) returns to where you were. Phones scroll <main> (the shell is
 * pinned to the screen); desktop scrolls the window. Opening a record in the
 * same page (?holding=12) leaves the scroll alone.
 */
const useScrollMemory = (main: RefObject<HTMLElement>) => {
  const location = useLocation();
  const navigation = useNavigationType();
  const saved = useRef(new Map<string, number>());
  const lastPath = useRef(location.pathname);
  // The entry scroll events belong to. Updated during the render that changes
  // pages, so the old page's final "scroll" (as it unmounts and the container
  // shrinks) can't overwrite where you were on it.
  const currentKey = useRef(location.key);

  const top = () =>
    isDesktop() ? window.scrollY : (main.current?.scrollTop ?? 0);
  const scrollTo = (y: number) => {
    if (isDesktop()) window.scrollTo(0, y);
    else if (main.current) main.current.scrollTop = y;
  };

  // Remember the position under the current history entry as the user
  // scrolls. Listening on the document (capture: scroll doesn't bubble) covers
  // both the window and <main>, whenever <main> exists.
  useEffect(() => {
    const remember = (event: Event) => {
      if (event.target === document || event.target === main.current)
        saved.current.set(currentKey.current, top());
    };
    document.addEventListener("scroll", remember, {
      capture: true,
      passive: true,
    });
    return () =>
      document.removeEventListener("scroll", remember, { capture: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    currentKey.current = location.key;
    const pathChanged = lastPath.current !== location.pathname;
    lastPath.current = location.pathname;

    if (navigation !== "POP") {
      if (pathChanged) scrollTo(0);
      return;
    }
    const y = saved.current.get(location.key);
    if (y === undefined) return;
    // The page may still be loading its content: keep trying for ~2s until
    // it's tall enough, unless the user starts scrolling themselves.
    let frames = 0;
    let frame = 0;
    let stopped = false;
    const stop = () => {
      stopped = true;
    };
    const attempt = () => {
      if (stopped) return;
      scrollTo(y);
      if (Math.abs(top() - y) > 1 && frames++ < 120)
        frame = requestAnimationFrame(attempt);
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    attempt();
    return () => {
      stop();
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);
};

export default useScrollMemory;
