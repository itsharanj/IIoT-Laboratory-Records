-- IIoT Lab: persistent admin overrides
create table if not exists public.experiment_overrides (
  experiment_id text primary key,
  code text,
  apparatus jsonb,
  settings jsonb,
  updated_at timestamptz not null default now()
);

alter table public.experiment_overrides enable row level security;

drop policy if exists "Anyone can read experiment overrides" on public.experiment_overrides;
drop policy if exists "Admins manage experiment overrides" on public.experiment_overrides;

create policy "Anyone can read experiment overrides"
  on public.experiment_overrides
  for select
  using (true);

create policy "Admins manage experiment overrides"
  on public.experiment_overrides
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- Student register-number login and persistent laboratory progress.
create table if not exists public.student_progress (
  register_number text primary key,
  completed_experiment_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.student_progress enable row level security;

drop policy if exists "Students can read progress" on public.student_progress;
drop policy if exists "Students can create progress" on public.student_progress;
drop policy if exists "Students can update progress" on public.student_progress;

-- Register number is the student's identifier for this lab record. The lab does not
-- use a password-based student account, so the progress table is intentionally
-- writable by the public client. Do not store sensitive personal information here.
create policy "Students can read progress"
  on public.student_progress for select
  using (true);

create policy "Students can create progress"
  on public.student_progress for insert
  with check (true);

create policy "Students can update progress"
  on public.student_progress for update
  using (true)
  with check (true);
