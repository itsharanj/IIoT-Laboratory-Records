alter table public.experiment_overrides
  add column if not exists content jsonb;
