# Database Usage Audit — Ito M1/M1.5

**Date:** 2025-06-25  
**Context:** Pre-M2 audit before `message_bank` schema.  
**Principle:** Persist only durable, user-meaningful events.

---

## Summary

| Verdict | Detail |
|---------|--------|
| **Noisy UI writes** | None found — scene taps, composer state, navigation are client-only |
| **Acceptable writes** | profiles upsert, threads insert, thread_members insert, pulses insert, auth via Supabase Auth |
| **Read patterns** | Some duplication (`requireProfile` per query helper); acceptable for M1 |
| **M2 readiness** | Safe to add seed `message_bank` rows + optional `bank_line_id` on `pulses` — no usage table needed unless tracking becomes complex |

---

## Flow-by-flow

### 1. Auth / session / profile requirement

| Op | Calls | Necessary? | Efficient? | Triage |
|----|-------|------------|------------|--------|
| **Reads** | `auth.getUser()` (middleware every request, session helpers) | Yes | OK for M1 | Accept |
| **Reads** | `profiles` select by id (middleware, `requireProfile`, invite page) | Yes | Duplicate on some pages | Investigate Now |
| **Writes** | Supabase Auth signUp/signIn/signOut (auth schema) | Yes | Expected | Accept |
| **Writes** | `profiles` upsert on onboarding | Yes | 1 row per user | Accept |

No trivial UI persistence.

---

### 2. Home `/`

| Op | Calls | Necessary? | Efficient? | Triage |
|----|-------|------------|------------|--------|
| **Reads** | `requireProfile` → profiles select | Yes | Duplicated | Investigate Now |
| **Reads** | `getUserThreads`: thread_members → threads → thread_members+profiles → pulses (last per thread) | Yes | 4 queries; could be 1 RPC/view later | Park for Later |
| **Reads** | `getInboxPulses`: pulses (limit 50) → profiles for senders | Yes | Full inbox for unread badge on home | Investigate Now |
| **Writes** | None | — | — | Accept |

Mapping to scene charms is in-memory only.

---

### 3. Thread list `/threads`

| Op | Calls | Necessary? | Efficient? | Triage |
|----|-------|------------|------------|--------|
| **Reads** | Same as `getUserThreads()` | Yes | Same as home | Park for Later |
| **Writes** | None | — | — | Accept |

---

### 4. Create thread `/threads/new`

| Op | Calls | Necessary? | Efficient? | Triage |
|----|-------|------------|------------|--------|
| **Reads** | `requireProfile` | Yes | — | Accept |
| **Writes** | `threads` insert (+ `.select("id")` — **required RLS fix**) | Yes | 1 row | Act Now (fixed) |
| **Writes** | `thread_members` insert (creator) | Yes | 1 row | Accept |
| **Writes** | Retry on invite_code collision (rare) | Yes | Max 5 attempts | Accept |

No extra rows beyond threads + thread_members.

---

### 5. Thread detail `/thread/[id]`

| Op | Calls | Necessary? | Efficient? | Triage |
|----|-------|------------|------------|--------|
| **Reads** | `requireProfile`, `getThreadDetail` (threads, thread_members+profiles) | Yes | — | Accept |
| **Reads** | `getInboxPulses()` (full inbox for unread count) | Partially | Over-fetch vs count query | Investigate Now |
| **Reads** | `pulses` last 1 for thread | Yes | — | Accept |
| **Writes** | None on page load | — | — | Accept |

---

### 6. Send pulse

| Op | Calls | Necessary? | Efficient? | Triage |
|----|-------|------------|------------|--------|
| **Reads** | `requireProfile`, `thread_members` for recipient | Yes | — | Accept |
| **Writes** | `pulses` insert (1 row per pulse) | Yes | Core product event | Accept |

Category/custom/default — all one durable row. M2 may add `bank_line_id` on same row (acceptable).

---

### 7. Inbox `/inbox`

| Op | Calls | Necessary? | Efficient? | Triage |
|----|-------|------------|------------|--------|
| **Reads** | `requireProfile`, `getInboxPulses` | Yes | limit 50 | Accept |
| **Writes** | None (`opened_at` not updated yet) | — | — | Park for Later |

---

### 8. Invite preview / accept

| Op | Calls | Necessary? | Efficient? | Triage |
|----|-------|------------|------------|--------|
| **Reads** | `get_invite_preview` RPC | Yes | Scoped lookup | Accept |
| **Reads** | `profiles` check on invite page / accept action | Yes | — | Accept |
| **Writes** | `accept_thread_invite` RPC: thread_members insert, optional threads status update | Yes | 1–2 durable ops | Accept |

---

## What we do NOT persist (correct)

- Scene taps, bird flyaway, pulse animation state
- Composer open/close, selected category (until send)
- Navigation, bottom sheet view state
- Unread calculations (derived from `opened_at`)
- Time-of-day / scene image selection
- Tailwind/UI class strings

---

## M2 guidance

| Item | Recommendation |
|------|----------------|
| `message_bank` seed rows | Static content; read-heavy, write-once |
| `bank_line_id` on `pulses` | Accept — explains which line was sent |
| Per-thread usage tracking | Prefer column on `pulses` or join history; avoid separate usage table unless non-repeat logic needs it |
| Usage analytics table | **Do not add** for M2 |

---

## Issue triage (audit)

| Priority | Item |
|----------|------|
| **Act Now** | Thread create RLS select policy (fixed in `20250625120000_allow_thread_creator_select.sql`) |
| **Investigate Now** | Duplicate `requireProfile` / redundant full inbox fetch on home + thread detail |
| **Park for Later** | `getUserThreads` multi-query consolidation; `opened_at` update on view |
| **Ignore/Accept Risk** | Middleware profile read per request; 1 pulse = 1 row |
