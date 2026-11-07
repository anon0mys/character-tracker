import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Client, ICharacterType } from "../Api";
import { useAuth } from "../Auth";
import { useError } from "../Errors";
import { Textarea } from "../Components/ui";
import {
  IdentityHeader,
  ReadOnlyBanner,
  ReadOnlyFieldset,
  SheetAccessProvider,
} from "../Components/Sheet";
import { useCharacterPatch } from "../Hooks/useCharacterPatch";

const placeholder = { name: "" } as ICharacterType;

const CharacterNotes = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState<ICharacterType>(placeholder);
  const { patch } = useCharacterPatch(character, setCharacter);
  const auth = useAuth();
  const client = Client();
  const errors = useError();

  useEffect(() => {
    client
      .get({ path: `/characters/${id}`, token: auth.getToken() })
      .then((response) => setCharacter(response.data))
      .catch((error) => errors.setError(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!character.id) {
    return (
      <p className="py-10 text-center text-muted-foreground">
        Loading character…
      </p>
    );
  }

  return (
    <SheetAccessProvider character={character}>
      <div className="flex flex-col gap-[14px]">
        <IdentityHeader character={character} onRested={setCharacter} />
        <ReadOnlyBanner name={character.name} />
        <ReadOnlyFieldset>
          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Notes
            </span>
            <Textarea
              value={character.notes ?? ""}
              onChange={(e) => patch({ notes: e.target.value })}
              placeholder="Session notes, reminders, anything…"
              className="min-h-[320px] resize-y bg-secondary font-body"
            />
            <span className="text-[11px] text-muted-foreground">
              Saved automatically.
            </span>
          </div>
        </ReadOnlyFieldset>
      </div>
    </SheetAccessProvider>
  );
};

export default CharacterNotes;
