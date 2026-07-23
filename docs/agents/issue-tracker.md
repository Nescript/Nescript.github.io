# Issue tracker

This repo uses **local markdown** for issue tracking.

Issues, feature requests, and specs are stored as markdown files under
`.scratch/<feature>/`. Each feature gets its own directory. Files follow the
convention:

- `issue.md` — a bug, question, or task
- `spec.md` — a specification or design doc
- `adr.md` — an architectural decision record

No GitHub Issues or external tracker is used. Skills that need to create or
read issues should write to and read from `.scratch/<feature>/`.
