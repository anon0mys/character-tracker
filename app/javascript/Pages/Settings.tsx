import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui";
import { ThemeToggle } from "../Components/ui/theme-toggle";

// Phase 1: Appearance card carrying the existing light/dark toggle.
// The 3-way theme radio, density, text size and thresholds arrive in Phase 6.
const Settings = () => {
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
    </div>
  );
};

export default Settings;
