# Dungeon Tracker — Vellum & Ink Redesign

Status: **ALL PHASES SHIPPED (0–6) 2026-09-29** on branch `ewheeler/rpg-tracker-redesign` (from `main`). See Living state for per-phase SHAs and Deferred for follow-ups.
Design source: **https://claude.ai/artifact/MCZ2jV3y2e4RayEENTH9fk** (Design canvas, 14 artboards). The canvas is live and gets edited — read the board with the Artifact tool (`read` with `path: project/<Board>.dc.html`) before implementing a screen; don't trust this doc's prose over the board.
Repo scope: this repo only (Rails 6.1 API + React 18 SPA in `app/javascript`). Backend changes are real but small until Phase 4.
Branch: `claude/rpg-tracker-redesign-14f184` (this worktree). Evan's convention is `ewheeler/<desc>`; rename or open PRs per phase — **Evan decides, ask before any git op.**
Mode: one phase at a time. Update **Living state** after each shipped phase so the next agent can pick up cold.

## Living state

| Phase | Title | Status | Commit |
|---|---|---|---|
| 0 | Tokens + type | ✅ | d69be4d |
| 1 | Shell: rail, tabs, routes, settings page | ✅ | d8e6942 |
| 2 | Sheet restructure (existing data only) | ✅ | d7344f4 + 36d376c |
| 3 | Forms + known bugs | ✅ | ab49a80 |
| 4a | Attacks: damage, action type, riders, Extra Attack | ✅ | 9c924ed |
| 4b | Resources (pips + consumables) | ✅ | e0b7841 |
| 4c | Temp HP, hit dice, death saves, conditions, spell slots | ✅ | ad1bb6b |
| 4d | Skills | ✅ | 877bae9 |
| 4e | Features page | ✅ | 8e30aa2 |
| 4f | Bio, languages, subclass | ✅ | 524a118 |
| 4g | Game status + HP thresholds | ✅ | 31e10fa |
| 4h | Loadouts | ✅ | 998cb20 |
| 5 | Party (cross-user characters) | ✅ | 63756d3 |
| 6 | Settings: density, text size, theme picker | ✅ | 35f00dd |

## Post-completion work (2026-09-29)

- **API bug fixed** — rescue_from ordering (483abaa), see below.
- **Mobile board-match shipped (67e104d):** `PinnedHp` sticky strip; `CharacterDisplay` splits desktop bands vs phone segmented Combat/Abilities/Skills/Bio; real bottom-tab screens `MobileAttacks` (expanding cards + 82px gutter + riders), `MobileSpells` (slot pips + full-screen `SpellDetail`), `MobileGear` (Gear/Consumables); `useCharacterData`/`useIsDesktop`; sub-routes redirect to the sheet at lg+. This clears the Phase 2 PinnedHp / Phase 4a mobile-attack-gutter deferrals.
- **Group A shipped (b4a6213):** coins editor in the Gear tab (desktop + mobile); add-resource in Consumables (reused TrackerForm). Restores features the redesign had dropped.
- **Group B shipped (31e9a3b):** Compendium fidelity — SpellsTab/ItemsTab board tables, DetailPane takeover (replaces SpellModal), single header, 2-col on lg / Dialog on phone.
- **Group C shipped (3722144):** deleted dead pre-redesign code (Pages/Spells+Items, Components/Spells/*, PlayPanel/*, Trackers index+Row, CurrencyFooter, CurrentCharacterButton, VisiitorNav, ItemRow); barrels trimmed. tsc + webpack clean.
- Still open (D/E/F): per-form pixel reskin; Home/Login/SignUp neon purge; `MobileFeatures`/`MobileCampaigns` boards not built as separate screens (Features + Dashboard are responsive). Visual 1440/390 pass still not run here.

## Deferred / follow-ups

- `UserProfile.tsx` links to `/profile` — no such route. Drop the link or add the page (Phase 1 decides).
- `AttackForm.tsx` is broken today: create and update are inverted (`isUpdate ? client.post : client.patch`) and the create URL is `/characters/undefined/attacks` because `CharacterDisplay` passes `attack={undefined}`. Fix in Phase 3.
- `Character` validates abilities `10..20`; `CharacterService#validate_ability_scores` validates `1..30`. Model wins. Loosen in Phase 2.
- `GamesController#update` is an empty method. Needed for status edits (Phase 4g).
- `characters#index` is `current_user.characters` — the design's party list and character switcher need other players' characters (Phase 5).
- No ESLint/Prettier config in the repo (`devDependencies` empty). Use `npx prettier --write <file>`; don't add configs without asking.
- Google Fonts `<link>` — check `config/initializers/content_security_policy.rb` before Phase 0; `csp_meta_tag` is in the layout.
- `class_data.json` skill proficiencies are prose ("Choose two from Arcana, …") parsed by regex in `CharacterService#extract_valid_skills`. Brittle; 4d relies on it for the "valid skills" hint only.
- ~~`rescue_from StandardError` ordering bug~~ **FIXED (483abaa)**: StandardError now declared first so specific handlers win; not-found returns 404. `error_handling_spec` locks it; `items_spec` asserts 404; also un-broke one pre-existing add_spell spec.
- **Worktree setup: `config/master.key`** is gitignored and absent in a fresh worktree, so `credentials.secret_key_base` is nil → every authenticated request spec 401s and the app can't verify JWTs. Copied from the main checkout for this session. Any new worktree needs it copied in.
- create/show character specs were stale exact-match (`eq`) hashes missing ~20 serializer fields; converted to `include`. Other exact-match body specs may exist.
- 17 pre-existing suite failures, all in §9 out-of-scope / unrelated areas (location, npc, user `is_game_admin?`, spell_list add_spell, create_user). Not touched by the redesign.
- Backend is **ahead of the plan**: ability validations already `1..30`; `character_params` already permits current_hitpoints, temp_hitpoints, death saves, exhaustion, spell_slots_used, hit_dice_remaining, concentration_spell; `characters#rest` implemented; `character_trackers` (Phase 4b's "resources") already modelled + routed (`/trackers`) with a serializer. Verify code before each phase; several phases are lighter than written.

## Update protocol

After each phase ships: move its row to ✅ with the SHA, append discovered follow-ups to Deferred, fill the phase's **Session notes**. If a design decision changes, edit **Decisions locked** and say why.

---

## 1. What the redesign is

Not a reskin. Three things:

1. **Palette + type.** Vellum & Ink (aged paper, ink, vermilion = harm, brass = proficiency, arcane blue = spells, green = vitality) by day; Nocturne (warm charcoal, ember, brass) by dark. Fraunces display / IBM Plex Sans body / IBM Plex Mono for every number. Maps onto the existing shadcn `hsl(var(--x))` system and the existing `.dark` class toggle with no component churn.
2. **Shell.** Top bar → left rail (desktop) with campaign switcher, character switcher, Party · Compendium · Settings, party HP, account. Phones get header + bottom tab bar. One rail, identical on every screen; only the highlight moves.
3. **Sheet.** Two pages, one mode. **Page one** = reference band (abilities · combat & casting · skills) / HP band / action band (attacks + Spells·Gear·Consumables panel). **Page two** = Features (infusions, class, racial, feat, blessings, bio). No separate "play mode" — on phones HP is pinned under the header on every tab instead.

Boards → phases:

| Board | Phase |
|---|---|
| `Main.dc.html` (system: palettes, type) | 0 |
| `Dashboard.dc.html`, `RailStates.dc.html`, `Compendium.dc.html`, `Settings.dc.html` | 1 (shell), 6 (settings body) |
| `CharacterSheet.dc.html`, `PanelStates.dc.html` | 2, then 4a–4d, 4h |
| `Features.dc.html` | 4e, 4f |
| `MobileCampaigns`, `MobileSheet`, `MobileAttacks`, `MobileSpells`, `MobileSpellDetail`, `MobileFeatures` | 1–2 (layout), 4 (content) |

Sample character on every board is **Kai, Artificer 13 (Armorer)** — real data from Evan's paper sheet. Use it as the acceptance fixture.

---

## 2. Decisions locked

| Question | Decision |
|---|---|
| Theming mechanism | Keep shadcn HSL vars + `.dark` class. Replace values, add semantic accents. `ThemeToggle` moves to Settings and becomes a 3-way radio (Vellum / Nocturne / System) in Phase 6. |
| Injury tiers | **Bloodied** (not "Blooded"). Serializer already says Bloodied; design boards say Blooded — design is wrong, fix boards later. |
| Play mode | Cut. One sheet. Mobile pins HP. |
| Detail panes | Tapping a spell/attack/item takes over the panel it came from (back arrow at top). Never an overlay over the sheet. Mobile pushes a full screen. |
| Sidebar | Identical component on every screen. Collapsible to 72px icon rail; state in `localStorage['railCollapsed']`. |
| Navigation | Rail: Party · Compendium · Settings. Wordmark → campaigns index. Campaign dropdown switches campaign; **no separate Campaigns nav item.** Items is a Compendium tab, **not** a nav item. |
| Skills on the sheet | Two columns, ~11 each. Custom skills allowed (Armorer, Tools, Alchemy). |
| Extra Attack | Marked per qualifying weapon attack (`extra_attack` boolean), never on the section header. |
| Mobile attacks | Expanding cards with an 82px right-aligned numeric gutter so to-hit values align. |
| Game status labels | Prepping = `pending`, Active = `active`, Wrapped = `finished`. "On hiatus" is not in the enum — drop from UI unless Evan adds a status. |
| Gear location | Sheet page one (tab). Features is the only thing on page two. |
| Git | No commits/branches/PRs without Evan's go. |
| Current-character state | **Reuse `auth.currentCharacter` + `auth.setCurrentCharacter`** (server-backed via `PATCH /users/current_character`). No `CharacterProvider`/`CharacterStore` — diverges from §5, which predated noticing auth already tracks it. Sheet/Rail read `useAuth()`. Evan approved 2026-09-19. |

---

## 3. Tokens

Existing var names are kept so every `bg-background` / `text-primary` / `border-border` picks up the palette for free. HSL triplets computed from the design hexes.

### Vellum (`:root`)

| Var | Hex | HSL | Role |
|---|---|---|---|
| `--background` | `#EBE0C8` | `41.1 46.7% 85.3%` | page |
| `--card`, `--popover` | `#FAF4E3` | `44.3 69.7% 93.5%` | cards, panels |
| `--foreground`, `--card-foreground` | `#1E1A13` | `38.2 22.4% 9.6%` | ink |
| `--primary` | `#A83A28` | `8.4 61.5% 40.8%` | vermilion — primary action, harm |
| `--primary-foreground` | `#FAF4E3` | `44.3 69.7% 93.5%` | |
| `--secondary`, `--muted`, `--accent` | `#F2E9D1` | `43.6 55.9% 88.4%` | sunken fills |
| `--secondary-foreground`, `--accent-foreground` | `#1E1A13` | `38.2 22.4% 9.6%` | |
| `--muted-foreground` | `#7A6C52` | `39.0 19.6% 40.0%` | captions (4.5:1 on card) |
| `--border`, `--input` | `#D9C9A6` | `41.2 40.2% 75.1%` | |
| `--ring` | `#8A6420` | `38.5 62.4% 33.3%` | brass focus ring |
| `--destructive` | `#A83A28` | `8.4 61.5% 40.8%` | |
| `--radius` | | `0.75rem` | design uses 12–14px |

New vars (add to both themes; expose via Tailwind):

| Var | Vellum | Nocturne |
|---|---|---|
| `--rail` | `41.4 43.8% 81.2%` (#E4D7BA) | `36.0 9.8% 10.0%` (#1C1A17) |
| `--border-strong` | `40.0 33.3% 64.7%` (#C3AF87) | `36.0 11.3% 26.1%` (#4A443B) |
| `--hairline` | `42.9 45.7% 82.0%` (#E6DABC) | `32.7 11.6% 18.6%` (#35302A) |
| `--foreground-2` | `40.0 20.0% 29.4%` (#5A503C) | `36.4 14.0% 60.8%` (#A99E8D) |
| `--harm` / `--harm-soft` | `8.4 61.5% 40.8%` / `20.0 52.9% 90.0%` | `10.6 70.3% 59.0%` / `12.5 30.0% 15.7%` |
| `--proficiency` / `--proficiency-soft` / `--proficiency-ink` | `38.5 62.4% 33.3%` / `42.9 58.3% 85.9%` / `38.4 64.2% 26.3%` | `38.7 62.2% 57.5%` / `50.0 15.8% 14.9%` / `38.7 62.2% 57.5%` |
| `--arcane` / `--arcane-soft` / `--arcane-ink` | `203.8 37.6% 27.6%` / `200.0 24.0% 90.2%` / `200.0 39.8% 22.2%` | `200.3 38.6% 65.5%` / `202.9 28.0% 14.7%` / `200.0 46.7% 73.5%` |
| `--vitality` / `--vitality-soft` / `--vitality-ink` | `113.9 29.7% 32.4%` / `93.8 30.8% 89.8%` / `114.0 30.8% 25.5%` | `99.7 26.3% 53.7%` / `103.6 14.7% 14.7%` / `99.1 34.0% 60.2%` |

### Nocturne (`.dark`)

| Var | Hex | HSL |
|---|---|---|
| `--background` | `#121110` | `30.0 5.9% 6.7%` |
| `--card`, `--popover` | `#1C1A17` | `36.0 9.8% 10.0%` |
| `--foreground` | `#F1EBE1` | `37.5 36.4% 91.4%` |
| `--primary` | `#E0674D` | `10.6 70.3% 59.0%` |
| `--primary-foreground` | `#14100E` | `20.0 17.6% 6.7%` |
| `--secondary`, `--muted`, `--accent` | `#24211D` | `34.3 10.8% 12.7%` |
| `--muted-foreground` | `#A99E8D` | `36.4 14.0% 60.8%` |
| `--border`, `--input` | `#35302A` | `32.7 11.6% 18.6%` |
| `--ring` | `#D6A64F` | `38.7 62.2% 57.5%` |
| `--destructive` | `#E0674D` | `10.6 70.3% 59.0%` |

### Fonts

```
--font-display: 'Fraunces', Georgia, serif;
--font-body:    'IBM Plex Sans', system-ui, sans-serif;
--font-mono:    'IBM Plex Mono', ui-monospace, monospace;
```
Google Fonts URL (already used by every board):
`https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap`

Rule: **every number is `font-mono`** — stats, modifiers, dice, HP, counts. Headings `font-display`. Everything else `font-body`.

---

## 4. Route map (target)

```
/                         Home (marketing; skinned Phase 1)
/login, /sign-up          Devise pages (skinned Phase 1)
/dashboard                Campaigns index (Games)
/characters               Party — character index for current game (restored as a real screen)
/characters/create        CharacterForm
/characters/:id           Sheet page one
/characters/:id/features  Sheet page two            (Phase 4e; placeholder tab until then)
/characters/:id/edit      CharacterForm
/compendium               → /compendium/spells
/compendium/spells        Spells browser (was /spells; old path redirects)
/compendium/items         Items table (was /items; old path redirects)
/settings                 Appearance (ThemeToggle moves here)
```

`GameSubRoute` guard stays on everything under a campaign. `/spells` currently sits *outside* the guard in `App.tsx` — keep Compendium outside it too (spells are global).

---

## 5. Component tree (target)

```
app/javascript/
  App.tsx                          routes per §4; wraps in CharacterProvider (new)
  Components/
    Shell/                         NEW
      Rail.tsx                     226px; collapsed 72px. Brand row, CampaignSwitcher, CharacterSwitcher,
                                   NavItem×3, PartyList, AccountFooter. Reads useGame(), useCharacter().
      BottomTabs.tsx               phone: Sheet · Attacks · Spells · Gear · Features (inside a character)
                                   or Campaigns · Compendium · Settings (outside one)
      MobileHeader.tsx             52px: back, title/subtitle, actions
      PinnedHp.tsx                 phone-only sticky HP strip (Phase 2)
    Layout.tsx                     becomes: <Rail/> + <main/> on lg+, <MobileHeader/> + <main/> + <BottomTabs/> below lg
    Sheet/                         NEW (Phase 2)
      IdentityHeader.tsx           avatar, name, class/race/bg/alignment/age, Sheet·Features·Notes segmented, Edit, Rest
      LoadoutBar.tsx               Phase 4h; hidden until then
      AbilitiesCard.tsx            3×2 tiles: score, mod, save (brass if proficient)
      CombatCard.tsx               4×2 tiles: AC, Init, Speed, Prof, Passive Perc, Spell DC, Spell Atk, Concentration + derivation line
      SkillsCard.tsx               Phase 4d; Phase 2 renders saves-only placeholder
      HpBand.tsx                   current/total, temp chip, bar with Bloodied/Mangled ticks, −/amount/+, hit dice, death saves, rest recovery
      AttacksCard.tsx              table (desktop) / expanding cards (phone); riders 4a
      RightPanel.tsx               tabs Spells · Gear · Consumables; panel takeover for detail
      SpellDetail.tsx              lifted from SpellModal body; no Dialog
      GearTab.tsx                  attuned + carried + coin (Phase 2 read-only from new endpoint)
      ConsumablesTab.tsx           Phase 4b; empty state in Phase 2
    Compendium/                    NEW (Phase 1) — SpellsTab (existing Spells page body), ItemsTab (existing Items page body), DetailPane
  Contexts/
    CharacterProvider.tsx          NEW — mirrors GameProvider; localStorage 'currentCharacter'
    CharacterStore.tsx             NEW — mirrors GameStore
  Pages/
    Compendium.tsx                 NEW
    Settings.tsx                   NEW
    Features.tsx                   NEW (4e)
    CharacterDisplay.tsx           becomes composition of Components/Sheet/*
```

Deleted/absorbed: `Components/Navbar/*` (TopNav → Rail), `Components/ui/theme-toggle.tsx` usage in Layout (moves to Settings). Neon class soup to purge everywhere: `bg-card/80 backdrop-blur-sm border-primary/30 shadow-lg`, `bg-card/95 backdrop-blur-xl`, `from-blue-500 to-purple-500`, `text-primary` on headings (headings are ink + `font-display`, not primary-colored).

---

## 6. Backend surface

Existing (`config/routes.rb`, `app/controllers/api/v1/*`):

| Endpoint | Used by | Notes |
|---|---|---|
| `GET/POST/PATCH/DELETE /api/v1/games` | Dashboard | `update` is empty — implement in 4g |
| `GET/POST/PATCH/DELETE /api/v1/characters` | Party, Sheet, Form | permit list lacks `current_hitpoints` — add in Phase 2 |
| `…/characters/:id/attacks` | AttacksCard, AttackForm | 4a adds columns |
| `…/characters/:id/spell_lists` (+ `POST …/add_spell`) | RightPanel Spells, AddSpellForm | |
| `GET /api/v1/spells` (pagy, filters name/archetype/level/school) | Compendium | keep pagination |
| `GET/POST/PATCH /api/v1/items` | Compendium Items | global items, no `show`/`destroy` |

New, by phase:

| Phase | Endpoint |
|---|---|
| 2 | `GET /api/v1/characters/:id/items` — `CharacterItemsController#index`, `CharacterItemSerializer` (item fields + `quantity`) |
| 4b | `…/characters/:id/resources` CRUD |
| 4c | `POST …/characters/:id/rest` `{ kind: short\|long }` (optional; client PATCH is acceptable) |
| 4e | `…/characters/:id/features` CRUD + `POST …/features/import_class` |
| 4h | `…/characters/:id/loadouts` CRUD + `POST …/loadouts/:id/activate` |
| 5 | `GET /api/v1/characters?game_id=` scoped through `Game#characters` with a Pundit policy on `user.in_game?` |

Serializer is Blueprinter (`app/serializers/character_serializer.rb`). Every new field goes there; the frontend type lives in `app/javascript/Api/types.tsx` — update both in the same commit.

---

## 7. Phases

Every phase ends with:
```bash
yarn build && yarn build:css
yarn tsc --noEmit
bundle exec rspec
bundle exec rubocop
npx prettier --write <touched .tsx files>
```
Run the app: `bin/rails s` in one terminal, `foreman start -f Procfile.dev` (webpack + postcss watch) in another. Postgres required. Verify visually at **1440** and **390** wide.

### Phase 0 — Tokens + type (½ day)

**Files**
- `app/assets/stylesheets/application.postcss.css` — replace every value in `:root` and `.dark` per §3; add the new vars; set `--radius: 0.75rem`; in `@layer base` set `body { font-family: var(--font-body) }` and add `h1,h2,h3 { font-family: var(--font-display) }`. Delete the "Modern Clean Theme" header comment; describe the palette instead.
- `tailwind.config.js` — `theme.extend.fontFamily = { display: 'var(--font-display)', body: 'var(--font-body)', mono: 'var(--font-mono)' }`; `theme.extend.colors` gains `rail`, `'border-strong'`, `hairline`, `'foreground-2'`, `harm`, `'harm-soft'`, `proficiency`, `'proficiency-soft'`, `'proficiency-ink'`, `arcane`, `'arcane-soft'`, `'arcane-ink'`, `vitality`, `'vitality-soft'`, `'vitality-ink'` — each `"hsl(var(--<name>))"`.
- `app/views/layouts/application.html.erb` — add `<link rel="preconnect" href="https://fonts.googleapis.com">`, `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`, and the css2 `<link>` from §3, above the stylesheet tag. Also: the layout includes `stylesheet_link_tag 'application'` twice — remove the duplicate.
- `config/initializers/content_security_policy.rb` — read it first. If a policy is enforced, allow `fonts.googleapis.com` (style-src) and `fonts.gstatic.com` (font-src).

**Acceptance**
- `grep -n "221.2 83.2% 53.3%" app/assets/stylesheets/application.postcss.css` → no matches.
- `yarn build:css` exits 0; `app/assets/builds/application.css` contains `--harm`.
- Dashboard renders on vellum; the existing ThemeToggle flips to Nocturne; no console CSP errors for fonts.
- Headings render in Fraunces (inspect computed `font-family`).

**Session notes**
Shipped d69be4d. CSP initializer is entirely commented (no enforced policy) → font-src change was a no-op. Duplicate `stylesheet_link_tag` removed. New accent tokens nested in tailwind (`harm.soft` → `bg-harm-soft`, etc.) — same utility names §3 intended. `build:css` verified `--harm`/`--font-display` in output. Visual check at 1440/390 not run here (no browser) — deferred to Evan / a `run` pass.

### Phase 1 — Shell (1–1½ days)

**Files**
- `Contexts/CharacterStore.tsx`, `Contexts/CharacterProvider.tsx` — copy the `GameStore`/`GameProvider` pattern exactly; key `currentCharacter`; expose `character`, `setCurrentCharacter`, `clearCurrentCharacter`. Export from `Contexts/index.jsx`.
- `App.tsx` — wrap in `<CharacterProvider>`; routes per §4; `<Navigate>` redirects for `/spells` → `/compendium/spells`, `/items` → `/compendium/items`.
- `Components/Shell/Rail.tsx` — build from `RailStates.dc.html`. Sections: brand row (logo → `/dashboard`, wordmark, collapse button); Campaign switcher = `DropdownMenu` listing `GET /games`, calls `setCurrentGame`; Character switcher = `DropdownMenu` listing `GET /characters` (current game), calls `setCurrentCharacter` + navigates to `/characters/:id`; nav items Party (`/characters`), Compendium (`/compendium`), Settings (`/settings`) using `NavLink` for active state; PartyList (Phase 1: `current_user.characters` in the game — full party arrives Phase 5); AccountFooter = existing `UserProfile` dropdown trimmed to email + Log Out (and Profile only if the route gets built).
- `Components/Shell/BottomTabs.tsx`, `MobileHeader.tsx` — from `MobileSheet.dc.html` / `MobileCampaigns.dc.html`. Two tab sets per §5.
- `Components/Layout.tsx` — `lg:` breakpoint splits rail vs mobile chrome. Remove `TopNav`, `ThemeToggle` from here.
- `Pages/Compendium.tsx` — segmented Spells | Items, mounts the existing `Spells.tsx` and `Items.tsx` bodies (extract their JSX into `Components/Compendium/SpellsTab.tsx`, `ItemsTab.tsx`; keep `useFilter`, pagination, `ItemForm`). Right-hand `DetailPane` replaces `SpellModal` on `lg+`; below `lg` keep the Dialog.
- `Pages/Settings.tsx` — Appearance card with the existing `ThemeToggle` for now (3-way radio is Phase 6).
- `Pages/Home.tsx`, `Login.tsx`, `SignUp.tsx` — purge neon classes; `font-display` headings; ink not primary.
- `Components/User/UserProfile.tsx` — remove gradient avatar classes; avatar = mono initials on `bg-arcane`.
- Delete `Components/Navbar/`.

**Acceptance**
- Every route in §4 renders with the rail; `/spells` and `/items` redirect.
- Rail is byte-identical markup on every screen except the active `NavLink`.
- Collapse persists across reload (`localStorage.railCollapsed`).
- At 390px: no rail, header + bottom tabs; every tap target ≥ 44px (check with DevTools device toolbar).
- `yarn tsc --noEmit` clean.

**Session notes**
Shipped d8e6942. tsc + webpack clean; built `application.js` committed (it is tracked/deployed; CSS is built at deploy, not committed). Divergences from the plan as written:
- **No CharacterProvider/Store** — reuse `auth.currentCharacter`/`setCurrentCharacter` (server-backed). See Decisions locked.
- **Compendium mounts the whole `Spells`/`Items` page components** (segmented control) rather than extracting their JSX into `SpellsTab`/`ItemsTab`. Consequence: each inner page keeps its own `<h1>`, so the Compendium header is doubled. `DetailPane`/`SpellModal`-on-lg not built — existing `SpellModal` Dialog still used. Follow-up: extract bodies + build DetailPane (Phase 2 touches the sheet's spell panel anyway).
- **Character bottom-tabs** Attacks/Spells/Gear currently route to the sheet (`/characters/:id`); they split out in Phase 2/4. Sheet + Features are real routes (Features = placeholder until 4e).
- **Home/Login/SignUp neon purge deferred** — signed-out pages render without shell chrome; tokens auto-reskin most, but literal `from-blue-500`/gradient classes remain. Fold into Phase 3 (forms reskin) or a polish pass.
- Rail "byte-identical markup" acceptance is met in spirit (one `<Rail>` component, only active NavLink + collapsed width differ), not literally.
Visual check at 1440/390 not run (no browser) — deferred to Evan / a `run` pass.

### Phase 2 — Sheet restructure, existing data only (2 days)

Board: `CharacterSheet.dc.html` (desktop), `MobileSheet.dc.html`, `MobileAttacks.dc.html`, `MobileSpells.dc.html`, `MobileSpellDetail.dc.html`, `PanelStates.dc.html`.

**Backend**
- `app/controllers/api/v1/characters_controller.rb` `character_params` — add `:current_hitpoints`.
- `app/models/character.rb` — change the six `numericality: { in: 10..20 }` to `in: 1..30` (matches `CharacterService`). Update `spec/models/character_spec.rb` if it asserts the old range.
- `app/serializers/character_serializer.rb` — add `field :hp_thresholds { { bloodied: 0.5, mangled: 0.25 } }` (hardcoded until 4g) so the bar ticks aren't a frontend constant.
- New `CharacterItemsController#index` + route `resources :items, only: :index` nested under characters; `CharacterItemSerializer` with item fields + `quantity`, `requires_attunement`. `spec/requests/api/v1/characters/items_spec.rb`.

**Frontend** — build `Components/Sheet/*` per §5 and compose `CharacterDisplay.tsx` from them.
- Bands in order: `IdentityHeader`, reference row (`AbilitiesCard` 272px · `CombatCard` flex · `SkillsCard` 372px — Phase 2 shows the six saves in the skills slot with an "Skills arrive in a later phase" caption), `HpBand`, action row (`AttacksCard` flex · `RightPanel` 430px).
- `HpBand`: −/+ buttons PATCH `current_hitpoints` clamped `[0, total_hitpoints]`; ticks at `hp_thresholds.bloodied * total` and `.mangled * total`; label from `injury_condition`. Temp HP renders `0` (real in 4c).
- `AttacksCard`: existing `name / bonus / description` as Name / Hit / Notes; Damage column shows `—` until 4a.
- `RightPanel`: Spells tab = current spell list rows + slot pips **omitted** (4c) + "Switch list" using the existing `Select`; tap a row → `SpellDetail` takes over the panel with a back arrow. Gear tab = `GET /characters/:id/items`. Consumables tab = empty state.
- Mobile: same components; `PinnedHp` sticky under `MobileHeader` on Sheet/Attacks/Spells/Gear tabs; attacks as cards with the 82px numeric gutter; spells list rows push `SpellDetail` full-screen.
- Every number `font-mono`.

**Acceptance**
- Kai fixture: create a level-13 artificer with INT 20, DEX 11; sheet shows AC/Init/Prof/DC/Atk matching `Character` model math (`ac`, `initiative`, `proficiency_bonus`, `spell_save_dc`, `spell_attack_mod`).
- Damage 13 → `current_hitpoints` decrements, label flips to Bloodied at < 50%, Mangled at < 25%.
- `bundle exec rspec spec/requests/api/v1/characters` green including the new items spec.
- At 390px the HP strip stays visible while scrolling any tab.

**Session notes**
Backend d7344f4, frontend 36d376c. Sheet composed from `Components/Sheet/*`.
Divergences / deferrals:
- Backend was mostly already done (validations, params, join). Only added the
  items endpoint + `hp_thresholds`.
- Sheet page: `PinnedHp` mobile-sticky strip **not yet built** — Layout is the
  global chrome; the sheet's own mobile HP pin (§5 PinnedHp) is deferred. HpBand
  renders inline on mobile for now.
- Death saves + hit dice are **display-only** (interactive in 4c). Temp HP shows
  real value (already serialized) rather than hardcoded 0.
- Rest button is live (uses existing `/rest`), ahead of the plan's 4c note.
- Old `PlayPanel`/`TrackersSection`/`CurrencyFooter`/`CurrentCharacterButton`
  now orphaned (still exported from `Components/Characters`); remove in a later
  cleanup or when Consumables/Gear absorb them.
- Mobile attack cards with the 82px numeric gutter (§ mobile) not built — Phase 4a.
- Visual 1440/390 check not run (no browser).

### Phase 3 — Forms + known bugs (1 day)

- Reskin: `Pages/CharacterForm.tsx` + `Components/Characters/{CharacterBioForm,CharacterStatsForm,AbilityScoresForm}.tsx`, `AttackForm.tsx`, `SpellListForm.tsx`, `AddSpellForm.tsx`, `Components/Games/GameForm.tsx`, `Components/Items/ItemForm.tsx`, `Components/Shared/ConfirmModal.tsx`. Purge the neon Dialog classes; labels `font-mono` uppercase caption style from the boards.
- **Fix `AttackForm`**: swap `post`/`patch` so create posts; take `characterId` as a prop and build the URL from it, not from `attack?.character_id`. Add `spec/requests/api/v1/attacks/create_attack_spec.rb` (none exists).
- `CharacterForm` zod: `speed` `min(25).max(50)` and abilities `min(10).max(20)` → match the loosened backend (`1..30`, speed `0..120`).
- Notes tab: migration `add_column :characters, :notes, :text`; permit; serializer; `Textarea` in the header's Notes segment.
- Wire "Edit" (exists), "Add attack", "New campaign", "Create list", "Switch list" from the new UI to these forms.

**Acceptance**: each form round-trips create + edit against the API; attack create spec green; `tsc` clean.

**Session notes**
Shipped ab49a80. AttackForm was already fixed in code (create posts) — added the
missing spec only. Notes: migration + permit + serializer + `/characters/:id/notes`
page. zod loosened (abilities 1..30, speed 0..120). De-neon done by mechanical
sweep (backdrop-blur, bg-card/NN, border-primary/NN, blue→purple gradient) rather
than a per-form pixel reskin — form dialogs are tokenised but not individually
rebuilt to the boards; a full form reskin remains as polish. This commit also
carries a one-time repo-wide prettier normalization (no config existed).
Full suite: 17 pre-existing failures (unchanged), new specs green.

### Phase 4 — Paper-sheet data

Each slice = migration + model + permit + serializer field + `Api/types.tsx` + UI + request spec. Independent; ship in any order; **4h last**.

**4a Attacks.** `add_column :attacks, :damage, :string`, `:action_type, :string, default: 'action'` (`action|bonus|reaction|dash`), `:extra_attack, :boolean, default: false`, `:riders, :jsonb, default: []` — rider = `{ name, tag, damage, note }`. `AttackSerializer` fields. `AttacksCard`: Damage column, `×2` badge when `extra_attack`, rider sub-rows (desktop) / expanded card body (phone). `AttackForm` gains the fields + a rider list editor.

**4b Resources.** `create_table :resources` — `character_id`, `name`, `kind` (`pips|count`), `max:int`, `current:int`, `recharge` (`short|long|dawn|none`), `color:string`, `position:int`. `ResourcesController` CRUD nested; `ResourceSerializer`; `character.resources` association + `has_many` in serializer. `ConsumablesTab`: pips rows (tap a pip → PATCH `current`), count rows with −/+ steppers. Kai fixture: Flash of Genius 5, Defensive Field 5, Infused items 7, Illithid Tattoo 2, Misty Step 1, Raven Queen 1, Potions ×3/×1/×1.

**4c HP extras + slots.** Columns on characters: `temp_hitpoints:int default 0`, `hit_dice_used:int default 0`, `death_save_successes:int default 0`, `death_save_failures:int default 0`, `conditions:string[] default []`, `spell_slots_used:jsonb default {}` (`{"1": 2, "3": 2}`). Serializer emits `spell_slots: [{ level, max, used }]` where `max` = `archetype.spell_slots_at_level(level)[i]` (already implemented in `Archetypes::Archetype`). `HpBand` temp chip + hit dice + death saves live; `RightPanel` Spells tab gains slot pips (tap → PATCH `spell_slots_used`); conditions chips under attacks. Optional `POST /characters/:id/rest`.

**4d Skills.** `add_column :characters, :expertise, :string, array: true, default: []`, `:custom_skills, :jsonb, default: []` (`{ name, ability, proficient, expertise }`). Serializer `skills: [{ name, ability, modifier, proficient, expertise }]` computed from `CharacterService::DND_SKILLS` × `proficiencies` (already accepts skill names) × `expertise`, plus custom. `SkillsCard` two columns, brass dot when proficient, `+ Add custom`. `CharacterStatsForm` gains skill checkboxes (valid set from `archetype.skill_proficiencies` via the existing regex helper — surface as a hint, don't block).

**4e Features page.** `create_table :features` — `character_id`, `category` (`class|racial|feat|infusion|item|blessing|other`), `name`, `description:text`, `resource_id` (nullable FK to resources for "N uses"), `position`. CRUD controller; `POST …/features/import_class` seeds from `archetype.features_at_level(1..level)` (`class_data.json`, loader exists). `Pages/Features.tsx` from `Features.dc.html` (3 columns + bio strip) and `MobileFeatures.dc.html` (chips). Route `/characters/:id/features`; segmented control on the sheet links to it.

**4f Bio.** Columns `subclass:string`, `trait`, `ideal`, `flaw`, `bond` (`:text`), `languages:string[] default []`. `IdentityHeader` shows subclass in the meta line; bio strip on Features page; `CharacterBioForm` fields.

**4g Games.** `add_column :games, :hp_thresholds, :jsonb, default: { bloodied: 0.5, mangled: 0.25 }`. `CharacterSerializer#hp_thresholds` and `#injury_condition` read `character.game.hp_thresholds`. Implement `GamesController#update` (permit `name, description, start_date, status, hp_thresholds`). Dashboard status chips per §2 mapping; Settings "Health thresholds" inputs PATCH the game.

**4h Loadouts.** `create_table :loadouts` — `character_id`, `name`, `active:boolean`, `modifiers:jsonb` = `{ speed_bonus:int, ac_bonus:int, attack_ids:[], notes }`. Exactly one active per character (model validation). `Character#ac`, `#speed` add the active loadout's bonuses; serializer emits `loadouts` and `active_loadout_id`; attacks gain `loadout_ids` so `AttacksCard` dims ones not in the active loadout. `LoadoutBar` in the header; `POST …/loadouts/:id/activate`. **Risk:** touches every derived stat — write model specs for `ac`/`speed` with and without an active loadout before UI.

**Session notes (4a–4h)**
_(empty)_

### Phase 5 — Party (½ day)

- `CharactersController#index`: when `params[:game_id]` present and `current_user.in_game?(game_id)`, return `Game.find(game_id).characters` via a `CharacterPolicy` (Pundit is already in the Gemfile; no policies exist yet — `app/policies/` is empty). Otherwise current behaviour.
- `PartyCharacterSerializer` (id, name, archetype, level, current/total HP) for the rail.
- `Rail.PartyList` and `CharacterSwitcher` fetch `/characters?game_id=`. Restrict `edit`/`destroy` to owner in the UI.

**Acceptance**: second user in the same game sees Kai in the rail with HP; cannot open Kai's edit form. Request spec for both cases.

### Phase 6 — Settings (½ day)

- `Pages/Settings.tsx` per `Settings.dc.html`: theme radio Vellum / Nocturne / System (System = `matchMedia` listener; replaces `ThemeToggle`), density segmented (`data-density="comfortable|compact"` on `<html>`; a few `--space-*` vars in CSS), text size range (`--text-scale` on `<html>`, `html { font-size: calc(16px * var(--text-scale)) }`), reduce motion checkbox, "Pin hit points on small screens" checkbox (default on; read by `PinnedHp`). All persisted in `localStorage`; a `users.preferences jsonb` column is optional later.
- Health thresholds card PATCHes the game (4g).

**Acceptance**: each control persists across reload and applies without a refresh.

---

## 8. Risks

1. **Validation drift** — model `10..20` vs service `1..30`. Phase 2 fixes; until then Kai's DEX 11 is fine but a real 8 is rejected.
2. **AttackForm is broken in prod today** (inverted verbs, `undefined` in URL). Phase 3, but it's a one-file fix if someone wants it sooner.
3. **Loadouts (4h)** change AC/speed derivation. Model specs first; ship last; cut if it drags.
4. **Party (5)** is the first cross-user read. Needs the Pundit policy; don't shortcut with `Character.where(game_id:)`.
5. **Sticky HP on iOS Safari** — `position: sticky` inside an `overflow` container breaks; keep the scroll container as the document, not an inner div.
6. **Fonts via Google** — CSP and offline. If CSP blocks, self-host the three woff2s under `app/assets/fonts` and `@font-face` them in the postcss file.
7. **`class_data.json` prose parsing** — only used for hints in 4d/4e. Never block a save on it.

## 9. Out of scope

Factions, locations, NPCs (tables exist, no UI, no design). GraphQL. ActiveAdmin skin. Multi-user roles UI (DM vs player) beyond read access in Phase 5. Dice rolling.
