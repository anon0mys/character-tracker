# Character Tracker

D&D 5e campaign tracker. Rails 6.1 API (`app/`, `config/routes.rb` → `/api/v1`) + React 18 SPA (`app/javascript/`, webpack → `app/assets/builds/`). Postgres. Devise + JWT. Blueprinter serializers. Tailwind + shadcn/Radix UI.

## In-flight work — read first

**`_spine/_plans/redesign.md`** — the Vellum & Ink redesign. Living-state table at the top says which phase is next. Each phase section is self-contained: files, changes, acceptance, commands. Fill its **Session notes** when you stop. The design source is a live Claude Design canvas linked at the top of that file; read the board before building a screen.

## Run

```bash
bin/rails s                            # API + serves the SPA shell
foreman start -f Procfile.dev          # webpack + postcss --watch
yarn build && yarn build:css           # one-shot build
yarn tsc --noEmit                      # type check (CI runs this)
bundle exec rspec                      # tests (CI)
bundle exec rubocop                    # Ruby lint (CI)
npx prettier --write <file>            # no repo config; run per touched file
```

Ruby 3.2.1, Node 24, Yarn 1.22. Postgres must be up.

## Conventions

- Injury tiers are **Healthy / Bloodied / Mangled** (serializer is source of truth).
- Every number in the UI is `font-mono`; headings `font-display`; body `font-body`.
- Theme = shadcn HSL vars in `app/assets/stylesheets/application.postcss.css`; `:root` is Vellum, `.dark` is Nocturne. Don't hardcode hexes in components.
- New API fields go in the serializer **and** `app/javascript/Api/types.tsx` in the same change.
- No git operations (commit, branch, PR) without an explicit go from Evan.
