# Domain docs

This repo uses a **single-context** layout.

- `CONTEXT.md` at the repo root is the primary source of domain context.
- `docs/adr/` at the repo root holds architectural decision records.

Agents should read `CONTEXT.md` before making changes that touch domain
terminology, core data models, or architectural seams. New ADRs go in
`docs/adr/` with a sequential or descriptive filename.
