-- LEGACY: Telegram Mini App prototype (ldr-couples-app)
-- NOT the target Ito schema. Archived for reference only — do not apply to new Ito databases.

create extension if not exists "pgcrypto";

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  telegram_user_id text unique not null,
  telegram_username text,
  first_name text,
  created_at timestamptz not null default now()
);

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

alter table public.app_users enable row level security;
alter table public.couples enable row level security;
alter table public.touches enable row level security;
