import type { ApparatusItem, Experiment, ExperimentSettings } from "../types/experiment";
import { supabase } from "./supabase";

export interface ExperimentOverride {
  experiment_id: string;
  code?: string | null;
  apparatus?: ApparatusItem[] | null;
  settings?: ExperimentSettings | null;
  updated_at?: string;
}

export async function loadExperimentOverrides(): Promise<Record<string, ExperimentOverride>> {
  if (!supabase) return {};
  const { data, error } = await supabase
    .from("experiment_overrides")
    .select("experiment_id, code, apparatus, settings, updated_at");

  if (error) {
    console.warn("Experiment overrides could not be loaded:", error.message);
    return {};
  }

  return Object.fromEntries(
    (data ?? []).map((row) => [row.experiment_id, row as ExperimentOverride]),
  );
}

export function mergeExperimentOverrides(
  experiments: Experiment[],
  overrides: Record<string, ExperimentOverride>,
): Experiment[] {
  return experiments.map((experiment) => {
    const override = overrides[experiment.id];
    if (!override) return experiment;

    return {
      ...experiment,
      code: override.code ?? experiment.code,
      apparatus: override.apparatus ?? experiment.apparatus,
      settings: {
        ...(experiment.settings ?? {}),
        ...(override.settings ?? {}),
      },
    };
  });
}

export async function saveExperimentOverride(
  experimentId: string,
  patch: Pick<ExperimentOverride, "code" | "apparatus" | "settings">,
) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase.from("experiment_overrides").upsert(
    {
      experiment_id: experimentId,
      code: patch.code ?? null,
      apparatus: patch.apparatus ?? null,
      settings: patch.settings ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "experiment_id" },
  );

  if (error) throw error;
}
