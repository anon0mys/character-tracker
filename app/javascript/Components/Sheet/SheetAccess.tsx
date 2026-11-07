import React, { createContext, useContext } from "react";
import { Eye } from "lucide-react";
import { ICharacterType } from "../../Api";
import { useAuth } from "../../Auth";

/** Whether the sheet on screen belongs to someone else (party members can look, not touch). */
const SheetAccessContext = createContext({ readOnly: false });

export const useSheetAccess = () => useContext(SheetAccessContext);

/** True when the signed-in user doesn't own this character. */
export const useIsReadOnly = (character: Pick<ICharacterType, "user_id">) => {
  const auth = useAuth();
  return character.user_id != null && character.user_id !== auth.user?.id;
};

export const SheetAccessProvider = ({
  character,
  children,
}: {
  character: Pick<ICharacterType, "user_id">;
  children: React.ReactNode;
}) => {
  const readOnly = useIsReadOnly(character);
  return (
    <SheetAccessContext.Provider value={{ readOnly }}>
      {children}
    </SheetAccessContext.Provider>
  );
};

/**
 * Disables every button and input inside it on someone else's sheet. Wrap
 * the controls that change things, not the ones that only navigate.
 */
export const ReadOnlyFieldset = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { readOnly } = useSheetAccess();
  return (
    <fieldset disabled={readOnly} className="contents">
      {children}
    </fieldset>
  );
};

export const ReadOnlyBanner = ({ name }: { name: string }) => {
  const { readOnly } = useSheetAccess();
  if (!readOnly) return null;
  return (
    <div
      role="status"
      className="flex items-center gap-2 rounded-[10px] border border-arcane-soft bg-arcane-soft px-[14px] py-[9px] text-[13px] text-arcane-ink"
    >
      <Eye className="h-4 w-4" aria-hidden />
      Viewing {name}'s sheet — read only
    </div>
  );
};
