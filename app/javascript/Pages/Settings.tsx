import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Button,
} from "../Components/ui";
import { useGame } from "../Contexts";
import { useAuth } from "../Auth";
import { useError } from "../Errors";
import { Client } from "../Api";
import { cn } from "../lib/utils";
import {
  ThemeChoice,
  Density,
  getTheme,
  getDensity,
  getTextScale,
  getReduceMotion,
  getPinHp,
  setTheme,
  setDensity,
  setTextScale,
  setReduceMotion,
  setPinHp,
} from "../Components/Shell/appearance";

const THEMES: { value: ThemeChoice; label: string; blurb: string }[] = [
  {
    value: "light",
    label: "Vellum & Ink",
    blurb: "Aged paper. Easiest for a long prep session.",
  },
  {
    value: "dark",
    label: "Nocturne",
    blurb: "Warm charcoal. Made for a phone at a dim table.",
  },
  {
    value: "system",
    label: "Match system",
    blurb: "Vellum by day, Nocturne after dark.",
  },
];

const Settings = () => {
  const { game, setCurrentGame } = useGame();
  const auth = useAuth();
  const client = Client();
  const errors = useError();

  const [theme, setThemeState] = useState<ThemeChoice>(getTheme());
  const [density, setDensityState] = useState<Density>(getDensity());
  const [textScale, setTextScaleState] = useState<number>(getTextScale());
  const [reduceMotion, setReduceMotionState] =
    useState<boolean>(getReduceMotion());
  const [pinHp, setPinHpState] = useState<boolean>(getPinHp());

  const asPct = (v?: number) => (v != null ? `${Math.round(v * 100)}` : "");
  const [bloodied, setBloodied] = useState(
    asPct(game?.hp_thresholds?.bloodied ?? 0.5),
  );
  const [mangled, setMangled] = useState(
    asPct(game?.hp_thresholds?.mangled ?? 0.25),
  );

  const pickTheme = (v: ThemeChoice) => {
    setThemeState(v);
    setTheme(v);
  };
  const pickDensity = (v: Density) => {
    setDensityState(v);
    setDensity(v);
  };
  const pickScale = (v: number) => {
    setTextScaleState(v);
    setTextScale(v);
  };
  const toggleMotion = (v: boolean) => {
    setReduceMotionState(v);
    setReduceMotion(v);
  };
  const togglePin = (v: boolean) => {
    setPinHpState(v);
    setPinHp(v);
  };

  const saveThresholds = () => {
    if (!game?.id) return;
    client
      .patch({
        path: `/games/${game.id}`,
        payload: {
          game: {
            hp_thresholds: {
              bloodied: (parseInt(bloodied, 10) || 50) / 100,
              mangled: (parseInt(mangled, 10) || 25) / 100,
            },
          },
        },
        token: auth.getToken(),
      })
      .then((r) => setCurrentGame(r.data))
      .catch((e) => errors.setError(e));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Appearance
        </h1>
        <p className="text-sm text-muted-foreground">
          How the tracker looks on every device you sign in on.
        </p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Theme
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {THEMES.map((t) => (
            <label
              key={t.value}
              className={cn(
                "flex cursor-pointer flex-col gap-2 rounded-2xl border bg-card p-4",
                theme === t.value
                  ? "border-2 border-proficiency"
                  : "border-border",
              )}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="theme"
                  checked={theme === t.value}
                  onChange={() => pickTheme(t.value)}
                  className="accent-[hsl(var(--proficiency))]"
                />
                <span className="font-display text-[18px] font-semibold">
                  {t.label}
                </span>
              </div>
              <span className="text-[12.5px] text-foreground-2">{t.blurb}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Density &amp; text</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[13.5px] font-semibold">Row density</span>
              <div className="flex rounded-[10px] bg-secondary p-[3px]">
                {(["comfortable", "compact"] as Density[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => pickDensity(d)}
                    className={cn(
                      "min-h-[40px] flex-grow rounded-lg text-[13px] capitalize",
                      density === d
                        ? "bg-card font-semibold"
                        : "text-foreground-2",
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline">
                <span className="text-[13.5px] font-semibold">Text size</span>
                <span className="ml-auto font-mono text-[12px] text-foreground-2">
                  {Math.round(textScale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={85}
                max={130}
                value={Math.round(textScale * 100)}
                onChange={(e) => pickScale(parseInt(e.target.value, 10) / 100)}
                className="w-full accent-[hsl(var(--proficiency))]"
              />
            </div>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={(e) => toggleMotion(e.target.checked)}
                className="mt-1 accent-[hsl(var(--proficiency))]"
              />
              <span className="flex flex-col">
                <span className="text-[14px] font-semibold">Reduce motion</span>
                <span className="text-[12.5px] text-foreground-2">
                  Drops the HP bar and pip transitions.
                </span>
              </span>
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">At the table</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={pinHp}
                onChange={(e) => togglePin(e.target.checked)}
                className="mt-1 accent-[hsl(var(--proficiency))]"
              />
              <span className="flex flex-col">
                <span className="text-[14px] font-semibold">
                  Pin hit points on small screens
                </span>
                <span className="text-[12.5px] text-foreground-2">
                  HP and damage/heal stay under the header on every section.
                </span>
              </span>
            </label>
            {game && (
              <div className="flex flex-col gap-2 border-t border-hairline pt-4">
                <span className="text-[13.5px] font-semibold">
                  Health thresholds — {game.name}
                </span>
                <div className="flex items-end gap-3">
                  <label className="flex flex-grow flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-proficiency-ink">
                      Bloodied
                    </span>
                    <Input
                      value={bloodied}
                      onChange={(e) =>
                        setBloodied(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      className="text-center font-mono"
                    />
                  </label>
                  <label className="flex flex-grow flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-harm">
                      Mangled
                    </span>
                    <Input
                      value={mangled}
                      onChange={(e) =>
                        setMangled(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      className="text-center font-mono"
                    />
                  </label>
                  <Button onClick={saveThresholds}>Save</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
