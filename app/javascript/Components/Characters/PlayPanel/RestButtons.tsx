import React, { useState } from "react";
import { Client, ICharacterType } from "../../../Api";
import { useAuth } from "../../../Auth";
import { useError } from "../../../Errors";
import { Button } from "../../ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";

interface Props {
  character: ICharacterType;
  onRested: (character: ICharacterType) => void;
}

const RestButtons = ({ character, onRested }: Props) => {
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const [confirmingLong, setConfirmingLong] = useState(false);
  const [busy, setBusy] = useState(false);

  const rest = (type: "short" | "long") => {
    if (!character.id) return;
    setBusy(true);
    client
      .post({
        path: `/characters/${character.id}/rest`,
        payload: { type },
        token: auth.getToken(),
        successMessage:
          type === "long" ? "Long rest complete" : "Short rest complete",
      })
      .then((response) => {
        onRested(response.data);
        setConfirmingLong(false);
      })
      .catch((err) => {
        errors.setError(err);
      })
      .finally(() => setBusy(false));
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => rest("short")}
          disabled={busy}
        >
          Short Rest
        </Button>
        <Button
          size="sm"
          onClick={() => setConfirmingLong(true)}
          disabled={busy}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Long Rest
        </Button>
      </div>
      <Dialog open={confirmingLong} onOpenChange={setConfirmingLong}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Take Long Rest?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Restores HP to max, clears temp HP and bonus max HP, resets all
            spell slots, recovers half your hit dice, clears death saves,
            reduces exhaustion by 1, and resets all trackers except
            manual/never.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmingLong(false)}>
              Cancel
            </Button>
            <Button onClick={() => rest("long")} disabled={busy}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RestButtons;
