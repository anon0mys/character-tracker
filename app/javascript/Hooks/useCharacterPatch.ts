import { useCallback, useEffect, useRef } from "react";
import { Client, ICharacterType } from "../Api";
import { useAuth } from "../Auth";
import { useError } from "../Errors";

type Updater = (updates: Partial<ICharacterType>) => void;

export const useCharacterPatch = (
  character: ICharacterType,
  setCharacter: React.Dispatch<React.SetStateAction<ICharacterType>>,
  debounceMs = 400,
): {
  patch: (
    updates: Partial<ICharacterType>,
    opts?: { debounce?: boolean },
  ) => void;
} => {
  const auth = useAuth();
  const errors = useError();
  const client = Client();
  const pendingRef = useRef<Partial<ICharacterType>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousRef = useRef<Partial<ICharacterType>>({});

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const flush = useCallback(() => {
    const updates = pendingRef.current;
    if (!Object.keys(updates).length || !character.id) return;
    pendingRef.current = {};
    client
      .patch({
        path: `/characters/${character.id}`,
        payload: { character: updates },
        token: auth.getToken(),
        showSuccessToast: false,
      })
      .then((response) => {
        setCharacter(response.data);
      })
      .catch((err) => {
        setCharacter((prev) => ({ ...prev, ...previousRef.current }));
        errors.setError(err);
      });
  }, [character.id, auth, client, errors, setCharacter]);

  const patch: ReturnType<typeof useCharacterPatch>["patch"] = useCallback(
    (updates, opts = { debounce: true }) => {
      const snapshot: Partial<ICharacterType> = {};
      Object.keys(updates).forEach((k) => {
        const key = k as keyof ICharacterType;
        if (!(key in previousRef.current)) {
          (snapshot as any)[key] = character[key];
        }
      });
      previousRef.current = { ...previousRef.current, ...snapshot };
      setCharacter((prev) => ({ ...prev, ...updates }));
      pendingRef.current = { ...pendingRef.current, ...updates };

      if (opts.debounce === false) {
        if (timerRef.current) clearTimeout(timerRef.current);
        flush();
        previousRef.current = {};
        return;
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        flush();
        previousRef.current = {};
      }, debounceMs);
    },
    [character, setCharacter, flush, debounceMs],
  );

  return { patch };
};
