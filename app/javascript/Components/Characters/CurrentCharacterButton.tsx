import React, { useState } from "react";
import { Button } from "../ui";
import { useAuth } from "../../Auth";
import { Star } from "lucide-react";

interface Props {
  characterId: number;
}

const CurrentCharacterButton = ({ characterId }: Props) => {
  const auth = useAuth();
  const [busy, setBusy] = useState(false);
  const isCurrent = auth.currentCharacter?.id === characterId;

  const toggle = async () => {
    setBusy(true);
    try {
      await auth.setCurrentCharacter(isCurrent ? null : characterId);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      size="lg"
      variant={isCurrent ? "default" : "outline"}
      onClick={toggle}
      disabled={busy}
      className={`w-full sm:w-auto min-h-[44px] ${isCurrent ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}`}
    >
      <Star className={`mr-2 h-4 w-4 ${isCurrent ? "fill-current" : ""}`} />
      {isCurrent ? "Current" : "Set as Current"}
    </Button>
  );
};

export default CurrentCharacterButton;
