import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Camera,
  CheckCircle2,
  ChevronDown,
  FileText,
  FileUp,
  FolderOpen,
  ImagePlus,
  LayoutDashboard,
  LifeBuoy,
  Monitor,
  Search,
  Server,
  Settings,
  Terminal,
  Trash2,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import type { Experiment } from "../types/experiment";
import { supabase } from "../lib/supabase";

type AssetType = "image" | "image-pdf" | "video" | "pdf";
type Slot = {
  label: string;
  hint: string;
  type: AssetType;
  icon: typeof Camera;
};
const profiles = {
  thingspeak: [
    {
      label: "Hardware Setup",
      hint: "Sensor, NodeMCU and wiring photo",
      type: "image",
      icon: Camera,
    },
    {
      label: "ThingSpeak Dashboard",
      hint: "Cloud graph or dashboard screenshot",
      type: "image",
      icon: ImagePlus,
    },
    {
      label: "Arduino Serial Monitor",
      hint: "Serial output screenshot or PDF",
      type: "image-pdf",
      icon: Terminal,
    },
    {
      label: "Tutorial Video",
      hint: "MP4 demonstration video",
      type: "video",
      icon: Video,
    },
    {
      label: "Experiment PDF",
      hint: "Report, output or notes",
      type: "pdf",
      icon: FileText,
    },
  ],
  packetTracer: [
    {
      label: "Software Screenshot 1",
      hint: "Packet Tracer topology or workspace",
      type: "image",
      icon: Monitor,
    },
    {
      label: "Software Screenshot 2",
      hint: "Configuration or simulation screen",
      type: "image",
      icon: Monitor,
    },
    {
      label: "Simulation Output",
      hint: "Event list or final output",
      type: "image",
      icon: ImagePlus,
    },
    {
      label: "Tutorial Video",
      hint: "MP4 Packet Tracer walkthrough",
      type: "video",
      icon: Video,
    },
    {
      label: "Experiment PDF",
      hint: "Report and configuration notes",
      type: "pdf",
      icon: FileText,
    },
  ],
  standard: [
    {
      label: "Hardware Setup",
      hint: "Circuit, sensor or wiring setup",
      type: "image",
      icon: Camera,
    },
    {
      label: "Output Screenshot",
      hint: "Dashboard, result or output image",
      type: "image",
      icon: ImagePlus,
    },
    {
      label: "Arduino Serial Monitor",
      hint: "Serial output screenshot or PDF",
      type: "image-pdf",
      icon: Terminal,
    },
    {
      label: "Tutorial Video",
      hint: "MP4 demonstration video",
      type: "video",
      icon: Video,
    },
    {
      label: "Experiment PDF",
      hint: "Report, output or notes",
      type: "pdf",
      icon: FileText,
    },
  ],
} satisfies Record<string, Slot[]>;
const accept = (type: AssetType) =>
  type === "image"
    ? "image/*"
    : type === "video"
      ? "video/*"
      : type === "pdf"
        ? "application/pdf"
        : "image/*,application/pdf";
const profile = (experiment?: Experiment) =>
  experiment?.category.toLowerCase().includes("packet tracer")
    ? "packetTracer"
    : experiment?.category.toLowerCase().includes("thingspeak")
      ? "thingspeak"
      : "standard";
const slotsFor = (experiment?: Experiment) => {
  const slots = profiles[profile(experiment)];
  const expNo = experiment?.expNo;

  if ([11, 12, 13].includes(expNo ?? 0)) {
    return slots.filter((slot) => {
      if (slot.label === "Hardware Setup") return false;
      return expNo !== 11 || slot.label !== "ThingSpeak Dashboard";
    });
  }

  if ([6, 7, 8, 9].includes(expNo ?? 0)) {
    return slots.map((slot) =>
      slot.label === "Arduino Serial Monitor"
        ? {
            ...slot,
            label: "Serial Monitor Pic",
            hint: "Arduino Serial Monitor output screenshot",
          }
        : slot,
    );
  }

  return slots;
};

export function AdminUpload({ experiments }: { experiments: Experiment[] }) {
  const [experimentId, setExperimentId] = useState(experiments[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const [existingMedia, setExistingMedia] = useState<
    { id: string; title: string; file_path: string; media_type: string; url: string }[]
  >([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const chosen = experiments.find((x) => x.id === experimentId);
  const slots = slotsFor(chosen);
  const categories = [
    "All",
    ...Array.from(new Set(experiments.map((x) => x.category))),
  ];
  const matches = useMemo(
    () =>
      experiments.filter(
        (e) =>
          (category === "All" || e.category === category) &&
          (!query ||
            `${e.expNo} ${e.title} ${e.category}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      ),
    [experiments, category, query],
  );
  const select = (id: string) => {
    setExperimentId(id);
    setFiles({});
    setStatus("");
    setQuery("");
    setOpen(false);
  };
  const loadExistingMedia = async () => {
    if (!supabase || !experimentId) return setExistingMedia([]);
    const { data } = await supabase
      .from("experiment_media")
      .select("id, title, file_path, media_type")
      .eq("experiment_id", experimentId)
      .order("created_at", { ascending: false });
    setExistingMedia((data ?? []).map((item) => ({ ...item, url: supabase.storage.from("experiment-media").getPublicUrl(item.file_path).data.publicUrl })));
  };
  useEffect(() => {
    loadExistingMedia();
  }, [experimentId]);
  const pick = (name: string, event: ChangeEvent<HTMLInputElement>) =>
    setFiles((current) => ({
      ...current,
      [name]: event.target.files?.[0] ?? null,
    }));
  const upload = async (slot: Slot) => {
    const file = files[slot.label];
    if (!supabase || !file)
      return setStatus(`Choose a file for ${slot.label}.`);
    const mediaType = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
        ? "video"
        : file.type === "application/pdf"
          ? "pdf"
          : null;
    if (!mediaType)
      return setStatus("Only image, video, and PDF files are allowed.");
    setUploading(slot.label);
    setStatus("");
    const path = `${experimentId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const stored = await supabase.storage
      .from("experiment-media")
      .upload(path, file);
    if (stored.error) {
      setUploading(null);
      return setStatus(stored.error.message);
    }
    const saved = await supabase
      .from("experiment_media")
      .insert({
        experiment_id: experimentId,
        title: slot.label,
        file_path: path,
        media_type: mediaType,
      });
    if (saved.error) {
      await supabase.storage.from("experiment-media").remove([path]);
      setStatus(saved.error.message);
    } else {
      setStatus(`${slot.label} uploaded to ${chosen?.title}.`);
      setFiles((current) => ({ ...current, [slot.label]: null }));
      await loadExistingMedia();
    }
    setUploading(null);
  };
  const removeMedia = async (media: {
    id: string;
    title: string;
    file_path: string;
  }) => {
    if (!supabase || !window.confirm(`Delete “${media.title}” permanently?`))
      return;
    setDeletingId(media.id);
    setStatus("");
    const removed = await supabase
      .from("experiment_media")
      .delete()
      .eq("id", media.id);
    if (removed.error) {
      setStatus(removed.error.message);
      setDeletingId(null);
      return;
    }
    const storageResult = await supabase.storage
      .from("experiment-media")
      .remove([media.file_path]);
    setStatus(
      storageResult.error
        ? `Record deleted, but file cleanup failed: ${storageResult.error.message}`
        : `${media.title} deleted.`,
    );
    await loadExistingMedia();
    setDeletingId(null);
  };
  const assetSet =
    profile(chosen) === "packetTracer"
      ? "Packet Tracer software evidence"
      : profile(chosen) === "thingspeak"
        ? "ThingSpeak cloud evidence"
        : "Hardware lab evidence";
  return (
    <section className="min-h-[calc(100vh-6rem)] rounded-[30px] bg-[#070b16] p-2 sm:p-3 shadow-[0_22px_55px_rgba(0,0,0,.4)]">
      <div className="overflow-hidden rounded-[24px] border border-cyan-300/10 bg-[#0b1020] text-white">
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#101936] via-[#18234a] to-[#111936] px-5">
          <div className="flex items-center gap-4">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-300/20">⌁</div>
            <div className="hidden w-64 items-center gap-2 rounded-full bg-white/[0.08] px-3 py-1.5 text-xs text-slate-300 ring-1 ring-white/10 sm:flex">
              <Search className="w-3.5 text-cyan-300" />
              <span>IIoT Asset Control</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[.15em] text-cyan-200/70">Control room</p>
            <p className="text-sm font-bold">Administrator!</p>
          </div>
        </header>
        <div className="grid xl:grid-cols-[minmax(0,1fr)_150px]">
          <main className="min-w-0 p-5 sm:p-7">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-200">
                  Dashboard · Lab Media Manager
                </p>
                <h1 className="mt-1 text-2xl font-black">
                  Experiment Asset Studio
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Upload the proof students need for each experiment.
                </p>
              </div>
              <span className="flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-bold text-emerald-200 ring-1 ring-emerald-300/20">
                <Activity className="w-3.5 h-3.5" /> Online
              </span>
            </div>
            <section className="rounded-2xl border border-white/10 bg-[#111a33] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
              <p className="text-[10px] font-bold tracking-[.15em] text-cyan-200">
                ACTIVE EXPERIMENT
              </p>
              <button
                onClick={() => setOpen((value) => !value)}
                className="mt-3 flex w-full items-center gap-3 rounded-xl bg-[#080d1c] px-3 py-3 text-left ring-1 ring-white/10 transition hover:ring-cyan-300/50"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-200 to-blue-500 text-xs font-black text-[#08101e]">
                  {String(chosen?.expNo ?? 0).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">
                    {chosen?.title}
                  </span>
                  <span className="block truncate text-xs text-violet-200/65">
                    {chosen?.category} · {assetSet}
                  </span>
                </span>
                <ChevronDown
                  className={`w-5 text-violet-200 transition ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && (
                <div className="mt-3 rounded-lg border border-violet-300/20 bg-[#120026] p-3">
                  <div className="flex items-center gap-2 rounded-md bg-white/5 px-3">
                    <Search className="w-4 text-violet-200" />
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search experiment number or title"
                      className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-violet-200/40"
                    />
                    <button onClick={() => setOpen(false)}>
                      <X className="w-4 text-violet-200" />
                    </button>
                  </div>
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {categories.map((item) => (
                      <button
                        key={item}
                        onClick={() => setCategory(item)}
                        className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-bold ${category === item ? "bg-[#bd70ff] text-[#210044]" : "bg-white/5 text-violet-200 hover:bg-white/10"}`}
                      >
                        {item === "All" ? "ALL" : item}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 grid max-h-64 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                    {matches.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => select(e.id)}
                        className={`flex gap-3 rounded-lg p-3 text-left ${e.id === experimentId ? "bg-[#6e25c7]" : "bg-white/5 hover:bg-white/10"}`}
                      >
                        <span className="text-xs font-black text-[#ffcf93]">
                          {String(e.expNo).padStart(2, "0")}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-bold">
                            {e.title}
                          </span>
                          <span className="block truncate text-[10px] text-violet-200/60">
                            {e.category}
                          </span>
                        </span>
                      </button>
                    ))}
                    {!matches.length && (
                      <p className="col-span-2 p-4 text-center text-sm text-violet-200/60">
                        No experiment found.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </section>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {slots.map((slot, index) => {
                const Icon = slot.icon;
                const file = files[slot.label];
                return (
                  <article
                    key={slot.label}
                    className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111a33] shadow-[0_10px_20px_rgba(0,0,0,.16)] transition hover:-translate-y-0.5 hover:border-cyan-300/25"
                  >
                    <div className="flex gap-3 border-b border-white/10 p-4">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-300/20">
                        <Icon className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-[10px] font-bold text-[#ffcf93]">
                          ASSET {String(index + 1).padStart(2, "0")}
                        </p>
                        <h2 className="text-sm font-bold">{slot.label}</h2>
                        <p className="mt-0.5 text-[11px] text-violet-200/60">
                          {slot.hint}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <label className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-dashed border-violet-300/35 bg-black/15 px-3 py-2.5 text-xs text-violet-100/70">
                        <span className="truncate">
                          {file?.name ?? "Choose a file"}
                        </span>
                        <span className="font-bold text-[#ffcf93]">BROWSE</span>
                        <input
                          key={`${experimentId}-${slot.label}-${file?.name ?? "empty"}`}
                          type="file"
                          accept={accept(slot.type)}
                          onChange={(event) => pick(slot.label, event)}
                          className="hidden"
                        />
                      </label>
                      <button
                        disabled={uploading !== null}
                        onClick={() => upload(slot)}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-black shadow-lg shadow-cyan-950/40 hover:brightness-110 disabled:opacity-50"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        {uploading === slot.label
                          ? "UPLOADING…"
                          : "UPLOAD ASSET"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            <section className="mt-5 rounded-xl border border-white/10 bg-[#25004c] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold tracking-[.15em] text-violet-200">
                    EXISTING UPLOADS
                  </p>
                  <h2 className="mt-1 text-sm font-bold">
                    Manage files for {chosen?.title}
                  </h2>
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold text-violet-200">
                  {existingMedia.length} files
                </span>
              </div>
              {existingMedia.length ? (
                <div className="mt-3 space-y-2">
                  {existingMedia.map((media) => (
                    <div
                      key={media.id}
                      className="flex items-center justify-between gap-3 rounded-lg bg-black/15 px-3 py-2.5"
                    >
                      {media.media_type === "image" && <img src={media.url} alt="" className="h-11 w-11 shrink-0 rounded-md border border-white/10 object-cover" />}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold">{media.title}</p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-wide text-violet-200/60">
                          {media.media_type}
                        </p>
                      </div>
                      <button
                        onClick={() => removeMedia(media)}
                        disabled={deletingId !== null}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-red-400/15 px-3 py-2 text-[11px] font-bold text-red-200 hover:bg-red-400/25 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deletingId === media.id ? "DELETING…" : "DELETE"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-lg bg-black/15 px-3 py-3 text-xs text-violet-200/60">
                  No uploads for this experiment yet.
                </p>
              )}
            </section>
            {status && (
              <div className="mt-5 flex gap-2 rounded-lg bg-emerald-400/15 px-4 py-3 text-sm text-emerald-100">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {status}
              </div>
            )}
          </main>
          <aside className="flex min-h-full flex-row justify-around border-t border-white/10 bg-[#0d1519] py-5 xl:flex-col xl:items-center xl:justify-start xl:gap-7 xl:border-l xl:border-t-0">
            <div className="hidden h-16 w-16 place-items-center rounded-full border-4 border-white bg-[#fffbf7] text-[#e77900] xl:grid">
              <Server className="w-7 h-7" />
            </div>
            <div className="hidden text-center xl:block">
              <p className="text-sm font-bold">SharanJ</p>
              <p className="text-[10px] text-slate-400">Administrator</p>
            </div>
            {[
              [LayoutDashboard, "Dashboard"],
              [FolderOpen, "Assets"],
              [LifeBuoy, "Support"],
              [Settings, "Settings"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Server;
              return (
                <button
                  key={label}
                  title={label}
                  className="grid h-9 w-9 place-items-center rounded-lg text-slate-300 transition hover:bg-[#6e25c7] hover:text-white"
                >
                  <I className="w-4 h-4" />
                </button>
              );
            })}
            <div className="hidden w-full border-t border-white/10 pt-5 text-center text-[10px] text-slate-500 xl:block">
              Destination
              <br />
              <span className="font-mono text-violet-200">{experimentId}</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
