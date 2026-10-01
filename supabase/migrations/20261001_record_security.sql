-- Security hardening for the IIoT record portal.
-- Student login remains register-number based, so student_progress cannot be
-- made private without changing the authentication model. Do not store secrets
-- or sensitive personal information in that table.
-- Student activity is not needed by the student-facing UI, so only administrators
-- should be able to read it.
alter table public.student_activity enable row level security;
drop policy if exists "Anyone can read student activity" on public.student_activity;
drop policy if exists "Admins can read student activity" on public.student_activity;
create policy "Admins can read student activity"
  on public.student_activity for select
  using (public.is_admin());

-- Students still need to write their own activity from the current register-number
-- login flow. Keep this policy limited to inserts and never expose activity rows
-- through the public client.
drop policy if exists "Students can write activity" on public.student_activity;
create policy "Students can write activity"
  on public.student_activity for insert
  with check (true);
