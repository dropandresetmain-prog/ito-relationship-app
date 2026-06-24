-- Allow thread creators to SELECT their own threads before thread_members row exists.
-- Fixes createThread() insert().select("id") failing RLS when only threads_select_member applied.

create policy threads_select_creator
  on public.threads for select
  using (created_by = auth.uid());
