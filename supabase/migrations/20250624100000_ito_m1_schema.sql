-- Ito M1 schema: profiles, threads, thread_members, pulses

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_thread_member(p_thread_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.thread_members
    where thread_id = p_thread_id and user_id = p_user_id
  );
$$;

revoke all on function public.is_thread_member(uuid, uuid) from public;
grant execute on function public.is_thread_member(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  avatar_url text,
  timezone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy profiles_select_own
  on public.profiles for select
  using (id = auth.uid());

create policy profiles_select_thread_peers
  on public.profiles for select
  using (
    profiles.id <> auth.uid()
    and exists (
      select 1 from public.thread_members tm
      where tm.user_id = profiles.id
        and public.is_thread_member(tm.thread_id, auth.uid())
    )
  );

create policy profiles_insert_own
  on public.profiles for insert
  with check (id = auth.uid());

create policy profiles_update_own
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- threads
-- ---------------------------------------------------------------------------

create table public.threads (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles (id) on delete cascade,
  relationship_mode text not null
    check (relationship_mode in (
      'clare', 'romantic', 'mother_son', 'family', 'friends', 'general'
    )),
  title text,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'archived')),
  invite_code text not null unique,
  invite_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index threads_created_by_idx on public.threads (created_by);
create index threads_invite_code_idx on public.threads (invite_code);

create trigger threads_set_updated_at
  before update on public.threads
  for each row execute function public.set_updated_at();

alter table public.threads enable row level security;

create policy threads_select_member
  on public.threads for select
  using (public.is_thread_member(threads.id, auth.uid()));

create policy threads_insert_authenticated
  on public.threads for insert
  with check (auth.uid() is not null and created_by = auth.uid());

create policy threads_update_member
  on public.threads for update
  using (public.is_thread_member(threads.id, auth.uid()));

-- ---------------------------------------------------------------------------
-- thread_members
-- ---------------------------------------------------------------------------

create table public.thread_members (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role_label text,
  display_name_override text,
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (thread_id, user_id)
);

create index thread_members_user_id_idx on public.thread_members (user_id);
create index thread_members_thread_id_idx on public.thread_members (thread_id);

alter table public.thread_members enable row level security;

create policy thread_members_select_own
  on public.thread_members for select
  using (user_id = auth.uid());

create policy thread_members_select_peer
  on public.thread_members for select
  using (
    user_id <> auth.uid()
    and public.is_thread_member(thread_id, auth.uid())
  );

create policy thread_members_insert_creator_self
  on public.thread_members for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.threads t
      where t.id = thread_id and t.created_by = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- pulses
-- ---------------------------------------------------------------------------

create table public.pulses (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads (id) on delete cascade,
  sender_user_id uuid not null references public.profiles (id) on delete cascade,
  recipient_user_id uuid not null references public.profiles (id) on delete cascade,
  pulse_kind text not null
    check (pulse_kind in ('default', 'category', 'custom')),
  category text
    check (
      category is null or category in (
        'loving', 'caring', 'encouraging', 'grateful',
        'missing_you', 'proud_of_you', 'just_because'
      )
    ),
  body text check (body is null or char_length(body) <= 140),
  opened_at timestamptz,
  created_at timestamptz not null default now(),
  constraint pulses_category_kind_check check (
    (pulse_kind = 'default' and category is null)
    or (pulse_kind = 'category' and category is not null)
    or (pulse_kind = 'custom' and body is not null)
  )
);

create index pulses_thread_id_idx on public.pulses (thread_id);
create index pulses_recipient_created_idx on public.pulses (recipient_user_id, created_at desc);

alter table public.pulses enable row level security;

create policy pulses_select_thread_member
  on public.pulses for select
  using (public.is_thread_member(pulses.thread_id, auth.uid()));

create policy pulses_insert_sender
  on public.pulses for insert
  with check (
    sender_user_id = auth.uid()
    and recipient_user_id <> auth.uid()
    and public.is_thread_member(pulses.thread_id, auth.uid())
    and public.is_thread_member(pulses.thread_id, pulses.recipient_user_id)
    and exists (
      select 1 from public.threads t
      where t.id = pulses.thread_id and t.status = 'active'
    )
  );

-- ---------------------------------------------------------------------------
-- Invite preview + accept (SECURITY DEFINER — scoped lookups without exposing
-- all pending threads)
-- ---------------------------------------------------------------------------

create or replace function public.get_invite_preview(p_invite_code text)
returns table (
  thread_id uuid,
  relationship_mode text,
  inviter_name text,
  member_count integer,
  status text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    t.id,
    t.relationship_mode,
    coalesce(p.display_name, 'Someone') as inviter_name,
    (select count(*)::integer from public.thread_members tm where tm.thread_id = t.id),
    t.status
  from public.threads t
  left join public.profiles p on p.id = t.created_by
  where upper(t.invite_code) = upper(trim(p_invite_code))
    and t.status <> 'archived'
    and (t.invite_expires_at is null or t.invite_expires_at > now());
end;
$$;

revoke all on function public.get_invite_preview(text) from public;
grant execute on function public.get_invite_preview(text) to anon, authenticated;

create or replace function public.accept_thread_invite(p_invite_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_thread public.threads%rowtype;
  v_member_count integer;
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_thread
  from public.threads
  where upper(invite_code) = upper(trim(p_invite_code))
  for update;

  if not found then
    raise exception 'Invite not found';
  end if;

  if v_thread.status = 'archived' then
    raise exception 'Thread is archived';
  end if;

  if v_thread.invite_expires_at is not null and v_thread.invite_expires_at < now() then
    raise exception 'Invite expired';
  end if;

  if v_thread.created_by = v_user_id then
    raise exception 'Cannot accept your own invite';
  end if;

  if exists (
    select 1 from public.thread_members
    where thread_id = v_thread.id and user_id = v_user_id
  ) then
    raise exception 'Already a member of this thread';
  end if;

  select count(*) into v_member_count
  from public.thread_members
  where thread_id = v_thread.id;

  if v_member_count >= 2 then
    raise exception 'This thread already has two members';
  end if;

  insert into public.thread_members (thread_id, user_id)
  values (v_thread.id, v_user_id);

  if v_member_count + 1 >= 2 then
    update public.threads
    set status = 'active', updated_at = now()
    where id = v_thread.id;
  end if;

  return v_thread.id;
end;
$$;

revoke all on function public.accept_thread_invite(text) from public;
grant execute on function public.accept_thread_invite(text) to authenticated;
