import React from "react";

// Phase 4b fills this from the resources/pips endpoint.
const ConsumablesTab = () => (
  <div className="flex flex-grow flex-col items-center justify-center gap-1 py-10 text-center">
    <p className="text-[13px] font-medium text-foreground-2">
      No consumables yet
    </p>
    <p className="text-[12px] text-muted-foreground">
      Pips and charges arrive in a later phase.
    </p>
  </div>
);

export default ConsumablesTab;
