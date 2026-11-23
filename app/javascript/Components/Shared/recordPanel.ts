/**
 * Classes for a record's panel (an item, NPC, place, compendium entry) while
 * it's open. Desktop: it sits beside its list, unchanged. Phone: it covers the
 * whole screen over the list, which stays mounted and scrolled underneath, so
 * closing it (its back button, or Back) returns to exactly where you were.
 */
export const PHONE_TAKEOVER =
  "max-lg:fixed max-lg:inset-0 max-lg:z-50 max-lg:m-0 max-lg:min-h-0 max-lg:max-h-none max-lg:w-auto max-lg:overflow-y-auto max-lg:rounded-none max-lg:border-0 max-lg:bg-background max-lg:p-4 max-lg:pb-12";
