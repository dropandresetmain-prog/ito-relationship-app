-- Milestone 1 schema: app_users, couples, touches

create extension if not exists "pgcrypto";

-- app_users: one row per Telegram user
create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  telegram_user_id text unique not null,
  telegram_username text,
  first_name text,
  created_at timestamptz not null default now()
);

-- couples: pairing between two users via invite code
create table if not exists public.couples (
  id uuid primary key default gen_random_uuid(),
  invite_code text unique not null,
  user_a_id uuid not null references public.app_users(id) on delete cascade,
  user_b_id uuid references public.app_users(id) on delete set null,
  created_at timestamptz not null default now(),
  paired_at timestamptz
);

create index if not exists couples_user_a_id_idx on public.couples(user_a_id);
create index if not exists couples_user_b_id_idx on public.couples(user_b_id);

-- touches: "Thinking of you" events
create table if not exists public.touches (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  sender_user_id uuid not null references public.app_users(id) on delete cascade,
  receiver_user_id uuid not null references public.app_users(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists touches_couple_id_idx on public.touches(couple_id);
create index if not exists touches_created_at_idx on public.touches(created_at desc);

-- RLS: all access goes through service role on the server; deny direct client access
alter table public.app_users enable row level security;
alter table public.couples enable row level security;
alter table public.touches enable row level security;

-- No policies for anon/authenticated — API routes use service role key server-side only
