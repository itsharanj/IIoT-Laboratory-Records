-- Run once in Supabase Dashboard -> SQL Editor.
create type public.app_role as enum ('admin', 'student');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'student',
  created_at timestamptz not null default now()
);

create table public.experiment_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  experiment_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, experiment_id)
);


create table if not exists public.experiment_overrides (
  experiment_id text primary key,
  code text,
  apparatus jsonb,
  settings jsonb,
  content jsonb,
  updated_at timestamptz not null default now()
);

alter table public.experiment_overrides enable row level security;
drop policy if exists "Anyone can read experiment overrides" on public.experiment_overrides;
drop policy if exists "Admins manage experiment overrides" on public.experiment_overrides;
create policy "Anyone can read experiment overrides"
  on public.experiment_overrides for select using (true);
create policy "Admins manage experiment overrides"
  on public.experiment_overrides for all
  using (public.is_admin())
  with check (public.is_admin());

create table public.experiment_media (
  id uuid primary key default gen_random_uuid(),
  experiment_id text not null,
  title text not null,
  file_path text not null,
  media_type text not null check (media_type in ('image', 'video', 'pdf')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

alter table public.profiles enable row level security;
alter table public.experiment_progress enable row level security;

create policy "Students can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Students can update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));
create policy "Admins can view profiles" on public.profiles for select using ((select role from public.profiles where id = auth.uid()) = 'admin');
create policy "Students manage own progress" on public.experiment_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins can view all progress" on public.experiment_progress for select using ((select role from public.profiles where id = auth.uid()) = 'admin');
alter table public.experiment_media enable row level security;
create policy "Anyone can view media metadata" on public.experiment_media for select using (true);
create policy "Admins manage media" on public.experiment_media for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public) values ('experiment-media', 'experiment-media', true) on conflict (id) do nothing;
create policy "Anyone can view lab files" on storage.objects for select using (bucket_id = 'experiment-media');
create policy "Admins upload lab files" on storage.objects for insert with check (bucket_id = 'experiment-media' and public.is_admin());
create policy "Admins delete lab files" on storage.objects for delete using (bucket_id = 'experiment-media' and public.is_admin());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Administrator'),
    case when lower(new.email) = 'sharanj2008@gmail.com' then 'admin'::public.app_role else 'student'::public.app_role end
  );
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- The email sharanj2008@gmail.com is promoted automatically by the trigger above.


-- Student register-number login and persistent progress
create table if not exists public.student_progress (
  register_number text primary key,
  student_name text,
  completed_experiment_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.student_progress
  add column if not exists student_name text;

alter table public.student_progress enable row level security;

drop policy if exists "Students can read progress" on public.student_progress;
drop policy if exists "Students can create progress" on public.student_progress;
drop policy if exists "Students can update progress" on public.student_progress;

create policy "Students can read progress" on public.student_progress for select using (true);
create policy "Students can create progress" on public.student_progress for insert with check (true);
create policy "Students can update progress" on public.student_progress for update using (true) with check (true);


-- 2026-09-27 student/admin upgrades
-- IIoT Lab: student status, activity log and admin settings
alter table public.student_progress
  add column if not exists experiment_status jsonb not null default '{}'::jsonb;

create table if not exists public.student_activity (
  id bigint generated by default as identity primary key,
  register_number text not null,
  action text not null,
  experiment_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.student_activity enable row level security;
drop policy if exists "Anyone can read student activity" on public.student_activity;
drop policy if exists "Students can write activity" on public.student_activity;
create policy "Anyone can read student activity" on public.student_activity for select using (true);
create policy "Students can write activity" on public.student_activity for insert with check (true);

create table if not exists public.lab_settings (
  id text primary key default 'default',
  college_name text not null default 'IIoT Laboratory',
  department text not null default 'Industrial IoT Laboratory',
  academic_year text not null default '',
  footer_text text not null default '© GPTI · Made by SharanJ',
  announcements jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.lab_settings enable row level security;
drop policy if exists "Anyone can read lab settings" on public.lab_settings;
drop policy if exists "Admins manage lab settings" on public.lab_settings;
create policy "Anyone can read lab settings" on public.lab_settings for select using (true);
create policy "Admins manage lab settings" on public.lab_settings for all using (public.is_admin()) with check (public.is_admin());
insert into public.lab_settings (id) values ('default') on conflict (id) do nothing;
