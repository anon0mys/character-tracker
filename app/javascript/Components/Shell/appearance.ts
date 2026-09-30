// Per-viewer appearance settings, persisted in localStorage and applied to
// <html>. Import for side-effect once at boot; Settings mutates via the setters.
export type ThemeChoice = "light" | "dark" | "system";
export type Density = "comfortable" | "compact";

const read = (key: string, fallback: string): string => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
};

export const getTheme = (): ThemeChoice =>
  read("theme", "system") as ThemeChoice;
export const getDensity = (): Density =>
  read("density", "comfortable") as Density;
export const getTextScale = (): number =>
  parseFloat(read("textScale", "1")) || 1;
export const getReduceMotion = (): boolean =>
  read("reduceMotion", "false") === "true";
export const getPinHp = (): boolean => read("pinHpMobile", "true") !== "false";

let mql: MediaQueryList | null = null;

const applyTheme = () => {
  const root = document.documentElement;
  const choice = getTheme();
  const systemDark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const dark = choice === "dark" || (choice === "system" && systemDark);
  root.classList.toggle("dark", !!dark);
  if (choice === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", choice);
  }
};

export const applyAppearance = () => {
  const root = document.documentElement;
  applyTheme();
  root.setAttribute("data-density", getDensity());
  root.style.setProperty("--text-scale", String(getTextScale()));
  root.setAttribute("data-reduce-motion", String(getReduceMotion()));

  // React to OS theme changes while on "system"
  if (typeof window !== "undefined" && window.matchMedia && !mql) {
    mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener?.("change", () => {
      if (getTheme() === "system") applyTheme();
    });
  }
};

export const setTheme = (v: ThemeChoice) => {
  write("theme", v);
  applyTheme();
};
export const setDensity = (v: Density) => {
  write("density", v);
  document.documentElement.setAttribute("data-density", v);
};
export const setTextScale = (v: number) => {
  write("textScale", String(v));
  document.documentElement.style.setProperty("--text-scale", String(v));
};
export const setReduceMotion = (v: boolean) => {
  write("reduceMotion", String(v));
  document.documentElement.setAttribute("data-reduce-motion", String(v));
};
export const setPinHp = (v: boolean) => write("pinHpMobile", String(v));

if (typeof document !== "undefined") {
  applyAppearance();
}
