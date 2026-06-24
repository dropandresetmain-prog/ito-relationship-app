# Known Issues

## Shell limitations

- **All data is mock** — nothing persists across refresh.
- **No authentication** — Supabase Auth not implemented.
- **No API routes** — pulse send, invite create/accept are UI-only.
- **No database** — target Ito schema does not exist yet.
- **No service worker** — manifest only; not installable offline.
- **No Web Push** — inbox is static mock content.
- **No photo moments, AI, or reminders** — placeholders in copy/settings only.

## UI gaps

- `/threads/new` and `/invite/[code]` forms are disabled mocks.
- `ReactionPicker` on thread page does not submit anywhere.
- No 404 page for unknown thread IDs (falls back to first mock thread).
- No automated tests.

## Legacy

- `supabase/migrations/legacy/` is the old Telegram prototype schema — **not** for new Ito DBs.
- Full prototype code lives on `backup/pre-ito-telegram-prototype`.

## Deployment

- Env vars in `.env.example` are commented placeholders only.
- PWA icons not yet added to `public/`.
