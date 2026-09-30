import { useEffect, useState } from "react";
import { Client, ICharacterType } from "../Api";
import { useAuth } from "../Auth";
import { useError } from "../Errors";
import { useCharacterPatch } from "./useCharacterPatch";

const placeholder = { name: "" } as ICharacterType;

// Loads one character and exposes the optimistic patch helper. Used by the
// phone screens (each is its own route) and reusable elsewhere.
export const useCharacterData = (id?: string) => {
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const [character, setCharacter] = useState<ICharacterType>(placeholder);
  const { patch } = useCharacterPatch(character, setCharacter);

  useEffect(() => {
    if (!id) return;
    client
      .get({ path: `/characters/${id}`, token: auth.getToken() })
      .then((r) => setCharacter(r.data))
      .catch((e) => errors.setError(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { character, setCharacter, patch, loaded: !!character.id };
};
