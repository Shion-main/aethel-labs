# `.context/` — project memory & codebase map

This folder is the durable, token-efficient memory for this project. Read it at the
start of a session instead of re-exploring the whole codebase.

## What's here

| File | Purpose |
| --- | --- |
| `MAP.md` | **The codebase map.** Architecture, every important file with a one-line purpose, the key systems (scroll engine, mood, transitions), conventions, brand tokens, commands, and current open threads. Kept current. |
| `sessions/INDEX.md` | Running index of ingested sessions (one line each). |
| `sessions/YYYY-MM-DD-*.md` | Per-session summaries — decisions made, what changed, state at end, open threads. |

## Protocol (for the assistant)

1. **At session start:** read `MAP.md` first (cheap, comprehensive). Skim the most
   recent 1–2 files in `sessions/` for in-flight context. Prefer this over reading
   source files; only open source when you need exact code.
2. **Keep `MAP.md` current:** when the architecture, file structure, key systems, or
   conventions change, update the relevant section of `MAP.md` in the same change.
   The map is wrong-is-worse-than-missing — fix it when you touch what it describes.
3. **Ingest a session ONLY when the user says so** (e.g. "ingest", "ingest the session",
   "save this session"). Do **not** auto-ingest. On the command:
   - Append `sessions/YYYY-MM-DD-<short-topic>.md` summarizing: goals, decisions,
     what changed (files/commits), current state, and open threads / next steps.
   - Add a one-line entry to `sessions/INDEX.md`.
   - Refresh any now-stale part of `MAP.md`.

## Why

Reading a single curated map costs a fraction of the tokens of re-deriving the
codebase each session, and the session log means context carries forward so nothing
has to be re-explained.
