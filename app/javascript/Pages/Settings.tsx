import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Button,
} from "../Components/ui";
import { ThemeToggle } from "../Components/ui/theme-toggle";
import { useGame } from "../Contexts";
import { useAuth } from "../Auth";
import { useError } from "../Errors";
import { Client } from "../Api";

// Phase 1 Appearance + Phase 4g health thresholds. The full theme radio /
// density / text-size controls land in Phase 6.
const Settings = () => {
  const { game, setCurrentGame } = useGame();
  const auth = useAuth();
  const client = Client();
  const errors = useError();

  const asPct = (v?: number) => (v != null ? `${Math.round(v * 100)}` : "");
  const [bloodied, setBloodied] = useState(
    asPct(game?.hp_thresholds?.bloodied ?? 0.5),
  );
  const [mangled, setMangled] = useState(
    asPct(game?.hp_thresholds?.mangled ?? 0.25),
  );

  const saveThresholds = () => {
    if (!game?.id) return;
    const payload = {
      game: {
        hp_thresholds: {
          bloodied: (parseInt(bloodied, 10) || 50) / 100,
          mangled: (parseInt(mangled, 10) || 25) / 100,
        },
      },
    };
    client
      .patch({ path: `/games/${game.id}`, payload, token: auth.getToken() })
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

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="font-display">Theme</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <span className="text-sm text-foreground-2">
            Switch between Vellum &amp; Ink and Nocturne.
          </span>
          <ThemeToggle />
        </CardContent>
      </Card>

      {game && (
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="font-display">Health thresholds</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-foreground-2">
              Drawn as ticks on every HP bar in <strong>{game.name}</strong>.
              Percent of max HP.
            </p>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings;
