# Campaign Journal

Status: **built 2026-11-07, uncommitted** on `main` alongside other in-flight work. Nothing committed — Evan decides.
Design source: **https://claude.ai/artifact/MCZ2jV3y2e4RayEENTH9fk**, row "The Journal — one record, written together" (`CampaignPage`, `JournalEntry`, `JournalLinks`, `MobileCampaign`, `MobileJournalEntry`, `JournalBacklinks`).
Sync harness (throwaway, scratchpad): relay / y-rb / update-log arms; the log arm is what shipped.

## Living state

| Piece | Status |
|---|---|
| Schema: `journal_entries`, `journal_entry_updates`, `journal_mentions` | ✅ |
| Cable: JWT `?token=` connection, `JournalEntryChannel`, `JournalPresenceChannel` | ✅ |
| API: entries CRUD, `mentions` typeahead, `journal_mentions` backlinks, `?id=` on items/spells/monsters | ✅ |
| SPA: `/campaigns/:id`, `/campaigns/:id/journal/:entryId`, editor, backlinks in panes + sheet | ✅ |
| Prod: `gem redis ~> 4.0`, compose `redis` service + `REDIS_URL` | ✅ (not deployed) |
| Specs | ✅ 554 examples, 0 failures (suite); 38 new examples |

## Decisions locked

- **Name:** Journal / `JournalEntry` — "Session" collides with auth sessions.
- **Shared** log per campaign; any member of the game edits (`current_user.games`).
- **Live co-editing** with Yjs over Action Cable. Rails never parses Yjs: it logs every update (`journal_entry_updates`, gapless per-entry `seq` under a row lock) and stores the client snapshot (`ydoc_state` + TipTap `body`). A client snapshots 2s after its last edit with `through_seq` = its **contiguous** watermark, and the server deletes log rows `<= through_seq`. Joiners get snapshot + remaining log. Zero loss if the only writer dies mid-debounce (harness check 4).
- **Links:** `@` people (Character; NPC later), `#` things (Item, Monster, Spell; Location, Faction later). Extension point: `JournalMention::MENTIONABLE_TYPES` + the typeahead in `MentionsController`.
- Mention node attrs `{ id, type, label }`; **label frozen** at write time; click through for the live record.
- **+ Create** from `#` when nothing matches → `ItemForm` prefilled → linked on save. Items are global (Compendium for every campaign).
- **Backlinks** ("Mentioned in the Journal") show the **current campaign only**, via `GET /games/:id/journal_mentions?type&id` (not serializer fields — those have no game context).
- Mentions/backlinks come from the last snapshot body, so they can lag ~2s behind the text, or until the next snapshot if the only writer crashed. Accepted.

## Gotchas found while building

- TipTap 2.1 `configure()` deep-merges plain objects into a `null` default — `CollaborationCursor`'s `provider: { awareness }` arrives as `{}`. Pass a class instance (`CursorProvider`).
- Two Mention extensions need distinct suggestion `pluginKey`s, and `allowSpaces: true` (names have spaces).
- Tailwind purges `@layer` rules for classes it never scans; TipTap's `collaboration-cursor__*` classes live outside any layer in `application.postcss.css`.
- `@tiptap/collaboration*` 2.1.11 pin `y-prosemirror` 1.0.20 exactly.
- `@tiptap/core` / `@tiptap/pm` were never installed at top level (TipTap was unused before this); now added.
- Spring can wedge on schema changes; `DISABLE_SPRING=1` for migrate/rspec if a command hangs.

## Deferred / follow-ups

- **Production Cable**: `config.action_cable.allowed_request_origins` / `url` for the real host are unset (commented in `production.rb`); needs the deploy host. Redis service must exist where prod runs.
- Dashboard + MobileCampaigns cards still say "Session N" (board copy and code) — rename to "Entry N" if wanted.
- No deleted-target detection: a chip to a deleted record opens the not-found state.
- `Spell` has a `default_scope` ordering by level, so `#` spell results sort by level before name.
- Compendium phone dialog overflows the right edge at 375px (pre-existing, seen while testing deep links).
- Dev DB has test data from verification: character **Venna** (id 15) in game 2 "Race Wars", journal entry 1, item **Wand of Glimmer** (id 831).

## Commands

```bash
bundle exec rspec spec/models/journal_entry_spec.rb spec/services/journal_mention_sync_spec.rb spec/requests/api/v1/journal_entries spec/channels
yarn tsc --noEmit && yarn build && yarn build:css
```
