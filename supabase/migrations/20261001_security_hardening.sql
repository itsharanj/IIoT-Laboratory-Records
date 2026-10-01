-- Security hardening (2026-10-01)
-- Activity logs contain student identifiers and must not be publicly readable.
alter table public.student_activity enable row level security;
drop policy if exists "Anyone can read student activity" on public.student_activity;
drop policy if exists "Admins can read student activity" on public.student_activity;
create policy "Admins can read student activity"
  on public.student_activity for select
  using (public.is_admin());

-- Student progress remains compatible with the current register-number portal.
-- NOTE: this is not strong authentication; see SECURITY.md. A future migration
-- should bind progress to auth.uid() before making the student portal authenticated.
