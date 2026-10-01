alter table public.student_progress
  add column if not exists student_name text;

comment on column public.student_progress.student_name is
  'Student display name collected when a register number is first used.';
