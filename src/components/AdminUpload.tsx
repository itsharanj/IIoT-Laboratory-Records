import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle, Box, Camera, CheckCircle2, ChevronDown, Code2, FileText,
  FolderOpen, Gauge, ImagePlus, LayoutDashboard, Monitor, Plus, Save,
  Search, Settings2, ShieldCheck, Terminal, Trash2, UploadCloud, Video,
  X, Eye, EyeOff, Wrench, Cloud, PanelLeft, Users, Activity, BarChart3, Download, RotateCcw, UserX, Settings, Megaphone, ExternalLink,
} from "lucide-react";
import type { ApparatusItem, Experiment, ExperimentSettings } from "../types/experiment";
import { supabase } from "../lib/supabase";
import { saveExperimentOverride } from "../lib/experimentOverrides";

type AssetType = "image" | "image-pdf" | "video" | "pdf";
type Slot = { key: string; label: string; hint: string; type: AssetType; icon: typeof Camera };
type Page = "overview" | "students" | "analytics" | "activity" | "experiment" | "code" | "components" | "media" | "gate" | "display" | "settings";
type MediaItem = { id: string; title: string; file_path: string; media_type: string; url: string };
type ConfirmState = { title: string; message: string; confirmLabel?: string; danger?: boolean; action: () => void } | null;

const standardSlots: Slot[] = [
  { key: "hardware", label: "Hardware Setup", hint: "Circuit, sensor or wiring photo", type: "image", icon: Camera },
  { key: "output", label: "Output Screenshot", hint: "Result or final output image", type: "image", icon: ImagePlus },
  { key: "serial", label: "Serial Monitor", hint: "Arduino / NodeMCU Serial Monitor screenshot", type: "image-pdf", icon: Terminal },
  { key: "video", label: "Tutorial Video", hint: "MP4 demonstration video", type: "video", icon: Video },
  { key: "pdf", label: "Experiment PDF", hint: "Report, output or notes", type: "pdf", icon: FileText },
];
const packetTracerSlots: Slot[] = [
  { key: "software-1", label: "Software Screenshot 1", hint: "Packet Tracer topology/workspace", type: "image", icon: Monitor },
  { key: "software-2", label: "Software Screenshot 2", hint: "Configuration/simulation screen", type: "image", icon: Monitor },
  { key: "output", label: "Simulation Output", hint: "Event list or final output", type: "image", icon: ImagePlus },
  { key: "video", label: "Tutorial Video", hint: "MP4 Packet Tracer walkthrough", type: "video", icon: Video },
  { key: "pdf", label: "Experiment PDF", hint: "Report and configuration notes", type: "pdf", icon: FileText },
];
const thingSpeakSlots: Slot[] = [
  { key: "hardware", label: "Hardware Setup", hint: "Sensor, NodeMCU and wiring photo", type: "image", icon: Camera },
  { key: "thingspeak", label: "ThingSpeak Dashboard", hint: "ThingSpeak cloud graph/dashboard screenshot", type: "image", icon: Cloud },
  { key: "serial", label: "Serial Monitor", hint: "Serial Monitor screenshot", type: "image-pdf", icon: Terminal },
  { key: "video", label: "Tutorial Video", hint: "MP4 demonstration video", type: "video", icon: Video },
  { key: "pdf", label: "Experiment PDF", hint: "Report, output or notes", type: "pdf", icon: FileText },
];

const defaultSettings: Required<ExperimentSettings> = {
  cautionEnabled: false,
  cautionMessage: "This experiment is not done yet. Please verify it by yourself. Once completed and verified, the administrator can update this status.",
  showHardwarePhoto: true,
  showSerialMonitor: true,
  showThingSpeakDashboard: true,
  showOutputPhoto: true,
};

const accept = (type: AssetType) => type === "image" ? "image/*" : type === "video" ? "video/*" : type === "pdf" ? "application/pdf" : "image/*,application/pdf";

function slotsFor(experiment?: Experiment): Slot[] {
  if (!experiment) return standardSlots;
  const category = experiment.category.toLowerCase();
  if (category.includes("packet tracer")) return packetTracerSlots;
  if (category.includes("thingspeak")) return thingSpeakSlots;
  if (experiment.expNo === 4 || experiment.expNo === 6 || experiment.expNo === 7 || experiment.expNo === 9) return standardSlots.filter((s) => ["hardware", "serial", "pdf"].includes(s.key));
  if (experiment.expNo === 8) return standardSlots.filter((s) => s.key !== "serial");
  return standardSlots;
}

const pageMeta: Record<Page, { label: string; title: string; icon: typeof LayoutDashboard }> = {
  overview: { label: "Overview", title: "Laboratory control centre", icon: LayoutDashboard },
  experiment: { label: "Experiment", title: "Experiment record", icon: FolderOpen },
  code: { label: "Program", title: "Code editor", icon: Code2 },
  components: { label: "Hardware", title: "Components & apparatus", icon: Wrench },
  media: { label: "Media", title: "Evidence & uploads", icon: ImagePlus },
  gate: { label: "Card gate", title: "Caution before opening", icon: AlertTriangle },
  display: { label: "Display", title: "Student-facing visibility", icon: Eye },
  students: { label: "Students", title: "Student management", icon: Users },
  analytics: { label: "Analytics", title: "Progress analytics", icon: BarChart3 },
  activity: { label: "Activity", title: "Recent activity", icon: Activity },
  settings: { label: "Settings", title: "Laboratory settings", icon: Settings },
};

function ConfirmModal({ state, onClose }: { state: ConfirmState; onClose: () => void }) {
  if (!state) return null;
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-black/65 px-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="admin-confirm" initial={{ opacity: 0, y: 12, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: .98 }}>
          <div className={`admin-confirm-icon ${state.danger ? "danger" : ""}`}><AlertTriangle className="h-5 w-5" /></div>
          <h2>{state.title}</h2>
          <p>{state.message}</p>
          <div className="admin-confirm-actions">
            <button onClick={onClose} className="admin-secondary-btn">Cancel</button>
            <button onClick={() => { state.action(); onClose(); }} className={`admin-primary-btn ${state.danger ? "danger-btn" : ""}`}>{state.confirmLabel ?? "Continue"}</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function PageButton({ page, active, onClick }: { page: Page; active: boolean; onClick: () => void }) {
  const meta = pageMeta[page];
  const Icon = meta.icon;
  return <button onClick={onClick} title={meta.label} className={`admin-dock-item ${active ? "active" : ""}`}><Icon className="h-[18px] w-[18px]" /><span>{meta.label}</span></button>;
}

export function AdminUpload({ experiments }: { experiments: Experiment[] }) {
  const [experimentId, setExperimentId] = useState(experiments[0]?.id ?? "");
  const [page, setPage] = useState<Page>("overview");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const [existingMedia, setExistingMedia] = useState<MediaItem[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [apparatus, setApparatus] = useState<ApparatusItem[]>([]);
  const [settings, setSettings] = useState<Required<ExperimentSettings>>(defaultSettings);
  const [savingEditor, setSavingEditor] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [mediaFilter, setMediaFilter] = useState("All media");
  const [students, setStudents] = useState<any[]>([]);
  const [studentQuery, setStudentQuery] = useState("");
  const [activity, setActivity] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState({ college_name: "IIoT Laboratory", department: "Industrial IoT Laboratory", academic_year: "", footer_text: "© GPTI · Made by SharanJ", announcements: [] as any[] });

  const chosen = experiments.find((x) => x.id === experimentId);
  const slots = slotsFor(chosen);
  const categories = ["All", ...Array.from(new Set(experiments.map((x) => x.category)))];
  const matches = useMemo(() => experiments.filter((e) => (category === "All" || e.category === category) && (!query || `${e.expNo} ${e.title} ${e.category}`.toLowerCase().includes(query.toLowerCase()))), [experiments, category, query]);
  const filteredMedia = mediaFilter === "All media" ? existingMedia : existingMedia.filter((item) => item.title === mediaFilter);


  const loadStudents = async () => {
    if (!supabase) return;
    const { data } = await supabase.from("student_progress").select("register_number, completed_experiment_ids, experiment_status, created_at, updated_at").order("updated_at", { ascending: false });
    setStudents(data ?? []);
  };
  const loadActivity = async () => {
    if (!supabase) return;
    const { data } = await supabase.from("student_activity").select("id, register_number, action, experiment_id, metadata, created_at").order("created_at", { ascending: false }).limit(100);
    setActivity(data ?? []);
  };
  const loadSiteSettings = async () => {
    if (!supabase) return;
    const { data } = await supabase.from("lab_settings").select("college_name, department, academic_year, footer_text, announcements").eq("id", "default").maybeSingle();
    if (data) setSiteSettings({ ...siteSettings, ...data });
  };

  useEffect(() => { void loadStudents(); void loadActivity(); void loadSiteSettings(); }, []);

  const resetStudent = (student: any) => runConfirmed("Reset student progress?", `All saved completion/status records for ${student.register_number} will be cleared.`, async () => {
    if (!supabase) return;
    const { error } = await supabase.from("student_progress").update({ completed_experiment_ids: [], experiment_status: {}, updated_at: new Date().toISOString() }).eq("register_number", student.register_number);
    setStatus(error ? error.message : `Progress reset for ${student.register_number}.`);
    await loadStudents();
  }, { danger: true, confirmLabel: "Reset progress" });
  const deleteStudent = (student: any) => runConfirmed("Delete student record?", `${student.register_number} will be removed from the laboratory progress table. This cannot be undone.`, async () => {
    if (!supabase) return;
    const { error } = await supabase.from("student_progress").delete().eq("register_number", student.register_number);
    setStatus(error ? error.message : `Student ${student.register_number} deleted.`);
    await loadStudents();
  }, { danger: true, confirmLabel: "Delete student" });
  const exportStudents = () => {
    const header = ["Register Number", "Completed", "In Progress", "Total", "Percentage", "Updated At"];
    const rows = students.map((s) => { const done = (s.completed_experiment_ids ?? []).length; const inProgress = Object.values(s.experiment_status ?? {}).filter((x: any) => x === "in_progress").length; return [s.register_number, done, inProgress, experiments.length, Math.round((done / experiments.length) * 100) + "%", s.updated_at ?? ""]; });
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); const a = document.createElement("a"); a.href = url; a.download = "iiot-student-progress.csv"; a.click(); URL.revokeObjectURL(url);
  };
  const saveSiteSettings = async () => {
    if (!supabase) return;
    const { error } = await supabase.from("lab_settings").upsert({ id: "default", ...siteSettings, updated_at: new Date().toISOString() }, { onConflict: "id" });
    setStatus(error ? error.message : "Laboratory settings published.");
  };

  const loadExistingMedia = async () => {
    if (!supabase || !experimentId) return setExistingMedia([]);
    const { data } = await supabase.from("experiment_media").select("id, title, file_path, media_type").eq("experiment_id", experimentId).order("created_at", { ascending: false });
    setExistingMedia((data ?? []).map((item) => ({ ...item, url: supabase.storage.from("experiment-media").getPublicUrl(item.file_path).data.publicUrl })));
  };

  useEffect(() => {
    if (!chosen) return;
    setCode(chosen.code || "");
    setApparatus(chosen.apparatus || []);
    setSettings({ ...defaultSettings, ...(chosen.settings || {}) });
    setFiles({});
    setStatus("");
    setMediaFilter("All media");
    loadExistingMedia();
  }, [experimentId]);

  const select = (id: string) => { setExperimentId(id); setQuery(""); setOpen(false); };
  const pick = (key: string, event: ChangeEvent<HTMLInputElement>) => setFiles((current) => ({ ...current, [key]: event.target.files?.[0] ?? null }));

  const runConfirmed = (title: string, message: string, action: () => void, options?: { danger?: boolean; confirmLabel?: string }) => setConfirm({ title, message, action, ...options });

  const uploadNow = async (slot: Slot) => {
    const file = files[slot.key];
    if (!supabase || !file) return setStatus(`Choose a file for ${slot.label}.`);
    const mediaType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : file.type === "application/pdf" ? "pdf" : null;
    if (!mediaType) return setStatus("Only image, video, and PDF files are allowed.");
    setUploading(slot.key); setStatus("");
    const path = `${experimentId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const stored = await supabase.storage.from("experiment-media").upload(path, file);
    if (stored.error) { setUploading(null); return setStatus(stored.error.message); }
    const saved = await supabase.from("experiment_media").insert({ experiment_id: experimentId, title: slot.label, file_path: path, media_type: mediaType });
    if (saved.error) {
      await supabase.storage.from("experiment-media").remove([path]);
      setStatus(saved.error.message);
    } else {
      setStatus(`${slot.label} uploaded successfully.`);
      setFiles((current) => ({ ...current, [slot.key]: null }));
      await loadExistingMedia();
    }
    setUploading(null);
  };

  const requestUpload = (slot: Slot) => {
    const file = files[slot.key];
    if (!file) return setStatus(`Choose a file for ${slot.label}.`);
    runConfirmed("Upload this asset?", `This will add “${file.name}” to ${chosen?.title ?? "the experiment"}. Continue?`, () => void uploadNow(slot), { confirmLabel: "Upload" });
  };

  const removeMedia = (media: MediaItem) => {
    runConfirmed("Delete this asset?", `“${media.title}” will be removed from the experiment and its stored file will be deleted. This cannot be undone.`, async () => {
      if (!supabase) return;
      setDeletingId(media.id); setStatus("");
      const removed = await supabase.from("experiment_media").delete().eq("id", media.id);
      if (removed.error) { setStatus(removed.error.message); setDeletingId(null); return; }
      const storageResult = await supabase.storage.from("experiment-media").remove([media.file_path]);
      setStatus(storageResult.error ? `Record deleted, file cleanup failed: ${storageResult.error.message}` : `${media.title} deleted.`);
      await loadExistingMedia(); setDeletingId(null);
    }, { danger: true, confirmLabel: "Delete" });
  };

  const saveEditorNow = async () => {
    if (!chosen) return;
    setSavingEditor(true); setStatus("");
    try { await saveExperimentOverride(chosen.id, { code, apparatus, settings }); setStatus("Changes saved successfully."); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Could not save changes."); }
    finally { setSavingEditor(false); }
  };
  const requestSave = () => runConfirmed("Save these changes?", "Your edited code, components and student-facing settings will replace the current saved values for this experiment.", () => void saveEditorNow(), { confirmLabel: "Save changes" });

  const updateComponent = (index: number, field: keyof ApparatusItem, value: string) => setApparatus((current) => current.map((item, i) => i === index ? { ...item, [field]: value } : item));
  const requestAddComponent = () => runConfirmed("Add component?", "A new component row will be added to this experiment. You will still need to save the experiment.", () => setApparatus((current) => [...current, { slNo: current.length + 1, name: "New Component", specs: "", quantity: "1 No." }]), { confirmLabel: "Add" });
  const requestRemoveComponent = (index: number) => runConfirmed("Remove this component?", `“${apparatus[index]?.name || "Component"}” will be removed from the current editor. Save only if you want to keep this change.`, () => setApparatus((current) => current.filter((_, i) => i !== index).map((item, i) => ({ ...item, slNo: i + 1 }))), { danger: true, confirmLabel: "Remove" });
  const requestSettingChange = (key: keyof Required<ExperimentSettings>, value: boolean) => runConfirmed("Change this setting?", `This will turn ${value ? "ON" : "OFF"} the ${key.replace(/^show/, "").replace(/Photo|Monitor|Dashboard/g, " $&").trim() || "setting"} for students.`, () => setSettings((current) => ({ ...current, [key]: value })), { confirmLabel: "Apply" });

  const nav = (next: Page) => setPage(next);

  const renderHeader = () => (
    <header className="admin-header">
      <div className="admin-command-brand">
        <div className="admin-logo"><ShieldCheck className="h-5 w-5" /></div>
        <div className="min-w-0"><p className="admin-eyebrow">IIoT Laboratory</p><h1 className="truncate text-[15px] font-semibold text-white">Command Center</h1></div>
      </div>
      <div className="admin-command-search">
        <Search className="h-4 w-4" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search experiments, students, actions…" />
        <kbd>⌘ K</kbd>
      </div>
      <div className="flex items-center gap-2">
        <span className="admin-live"><span /> SYSTEM LIVE</span>
        <button onClick={() => nav("overview")} className="admin-header-btn"><PanelLeft className="h-4 w-4" /> Dashboard</button>
      </div>
    </header>
  );

  const renderExperimentPicker = () => (
    <section className="admin-card admin-window-picker relative z-30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="admin-kicker">Current experiment</p><h2 className="mt-1 text-base font-semibold text-white">{String(chosen?.expNo ?? 0).padStart(2, "0")} · {chosen?.title}</h2><p className="mt-1 text-xs text-zinc-400">{chosen?.category}</p></div>
        <button onClick={() => setOpen((v) => !v)} className="admin-select"><span>Switch experiment</span><ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} /></button>
      </div>
      <AnimatePresence>
        {open && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-4 rounded-2xl border border-white/10 bg-[#111113] p-3 shadow-2xl">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3"><Search className="h-4 text-zinc-500" /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search experiment…" className="w-full bg-transparent py-3 text-sm text-white outline-none" /><button onClick={() => setOpen(false)}><X className="h-4 text-zinc-500" /></button></div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ${category === item ? "bg-[#0a84ff] text-white" : "bg-white/[.05] text-zinc-400"}`}>{item === "All" ? "ALL" : item}</button>)}</div>
          <div className="mt-3 grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2">{matches.map((e) => <button key={e.id} onClick={() => select(e.id)} className={`rounded-xl p-3 text-left transition ${e.id === experimentId ? "bg-[#0a84ff] text-white" : "bg-white/[.04] text-zinc-200 hover:bg-white/[.08]"}`}><span className="mr-2 text-xs font-black">{String(e.expNo).padStart(2, "0")}</span><span className="text-xs font-semibold">{e.title}</span></button>)}</div>
        </motion.div>}
      </AnimatePresence>
    </section>
  );

  const statCards = [
    { label: "Experiments", value: experiments.length, icon: FolderOpen },
    { label: "Components", value: apparatus.length, icon: Box },
    { label: "Uploaded assets", value: existingMedia.length, icon: ImagePlus },
    { label: "Card caution", value: settings.cautionEnabled ? "ON" : "OFF", icon: AlertTriangle },
  ];

  const renderOverview = () => <div className="space-y-4">
    <div className="admin-hero"><div><p className="admin-kicker">Administrator workspace</p><h2>Manage the laboratory without touching the source files.</h2><p>Edit one experiment at a time, review evidence, control the student view, and save only after confirmation.</p></div><div className="admin-hero-orb"><Gauge className="h-7 w-7" /></div></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{statCards.map(({ label, value, icon: Icon }) => <div key={label} className="admin-stat"><Icon className="h-4 w-4 text-[#60a5fa]" /><span>{label}</span><strong>{value}</strong></div>)}</div>
    <div className="grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
      <div className="admin-card"><div className="flex items-center justify-between"><div><p className="admin-kicker">Quick actions</p><h3 className="admin-section-title">Open a dedicated workspace</h3></div><Settings2 className="h-5 w-5 text-zinc-500" /></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{(["students","analytics","activity","experiment","code","components","media","gate","display","settings"] as Page[]).map((p) => { const M = pageMeta[p]; const Icon = M.icon; return <button key={p} onClick={() => nav(p)} className="admin-action-row"><span className="admin-action-icon"><Icon className="h-4 w-4" /></span><span><b>{M.label}</b><small>{M.title}</small></span><ChevronDown className="ml-auto h-4 w-4 -rotate-90 text-zinc-600" /></button>; })}</div></div>
      <div className="admin-card"><p className="admin-kicker">Safety</p><h3 className="admin-section-title">Every destructive change asks first</h3><p className="mt-3 text-sm leading-6 text-zinc-400">Delete, upload, add/remove, visibility changes and saved edits use a confirmation step. Draft text stays local until you explicitly save it.</p><div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[.06] p-3 text-xs text-emerald-300"><CheckCircle2 className="h-4 w-4" /> Protected admin workflow</div></div>
    </div>
  </div>;

  const renderExperiment = () => <div className="space-y-4"><div className="admin-card"><div className="flex items-center gap-3"><div className="admin-icon-box"><FolderOpen className="h-5 w-5" /></div><div><p className="admin-kicker">Experiment record</p><h2 className="admin-section-title">{chosen?.title}</h2></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Info label="Experiment" value={`#${chosen?.expNo}`} /><Info label="Category" value={chosen?.category ?? "—"} /><Info label="Language" value={chosen?.codeLanguage ?? "—"} /><Info label="Code file" value={chosen?.codeFilename ?? "—"} /></div></div><div className="admin-card"><p className="admin-kicker">Student content</p><h3 className="admin-section-title">Aim</h3><p className="mt-3 text-sm leading-7 text-zinc-300">{chosen?.aim}</p><h3 className="admin-section-title mt-6">Conclusion</h3><p className="mt-3 text-sm leading-7 text-zinc-300">{chosen?.conclusion}</p></div></div>;

  const renderCode = () => <div className="space-y-4"><div className="admin-card"><div className="flex items-center justify-between gap-3"><div><p className="admin-kicker">Program</p><h2 className="admin-section-title">Direct code editor</h2><p className="mt-1 text-xs text-zinc-500">Changes remain draft until you confirm Save changes.</p></div><Code2 className="h-5 w-5 text-[#60a5fa]" /></div><textarea value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} className="admin-code-editor mt-4" /></div><SaveBar onSave={requestSave} saving={savingEditor} /></div>;

  const renderComponents = () => <div className="space-y-4"><div className="admin-card"><div className="flex items-center justify-between gap-3"><div><p className="admin-kicker">Hardware</p><h2 className="admin-section-title">Components & apparatus</h2></div><button onClick={requestAddComponent} className="admin-primary-btn"><Plus className="h-4 w-4" /> Add component</button></div><div className="mt-4 space-y-3">{apparatus.map((item, index) => <div key={`${index}-${item.name}`} className="admin-component"><div className="flex items-center justify-between"><span className="text-[10px] font-semibold tracking-[.15em] text-zinc-600">COMPONENT {String(index + 1).padStart(2, "0")}</span><button onClick={() => requestRemoveComponent(index)} className="admin-icon-danger" title="Remove component"><Trash2 className="h-4 w-4" /></button></div><div className="mt-3 grid gap-2 md:grid-cols-[1.4fr_1fr_.5fr]"><input value={item.name} onChange={(e) => updateComponent(index, "name", e.target.value)} placeholder="Component name" className="admin-input" /><input value={item.specs} onChange={(e) => updateComponent(index, "specs", e.target.value)} placeholder="Specifications" className="admin-input" /><input value={item.quantity} onChange={(e) => updateComponent(index, "quantity", e.target.value)} placeholder="Quantity" className="admin-input" /></div></div>)}{!apparatus.length && <EmptyState icon={Box} text="No components configured for this experiment." />}</div></div><SaveBar onSave={requestSave} saving={savingEditor} /></div>;

  const renderMedia = () => {
    const currentSlot = mediaFilter === "All media" ? slots[0] : slots.find((slot) => slot.label === mediaFilter) ?? slots[0];
    const currentMedia = mediaFilter === "All media" ? existingMedia : filteredMedia;
    return <div className="space-y-4"><div className="admin-card"><div className="flex items-center justify-between gap-3"><div><p className="admin-kicker">Evidence</p><h2 className="admin-section-title">One asset type per page</h2><p className="mt-1 text-xs text-zinc-500">Choose Hardware, Serial Monitor, ThingSpeak, Output or another asset. Only that asset workspace is shown.</p></div><UploadCloud className="h-5 w-5 text-zinc-500" /></div><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{slots.map((slot) => <button key={slot.key} onClick={() => setMediaFilter(slot.label)} className={`admin-pill ${mediaFilter === slot.label || (mediaFilter === "All media" && slot.key === currentSlot.key) ? "active" : ""}`}>{slot.label}</button>)}</div></div><UploadCard slot={currentSlot} file={files[currentSlot.key]} onPick={pick} onUpload={requestUpload} uploading={uploading} /><div className="admin-card"><div className="flex items-center justify-between"><div><p className="admin-kicker">Stored files</p><h3 className="admin-section-title">{currentSlot.label}</h3></div><span className="admin-count">{currentMedia.length}</span></div><div className="mt-4 space-y-2">{currentMedia.map((media) => <div key={media.id} className="admin-media-row">{media.media_type === "image" ? <img src={media.url} alt="" /> : <span className="admin-media-thumb"><FileText className="h-4 w-4" /></span>}<div className="min-w-0 flex-1"><b>{media.title}</b><small>{media.media_type} · {media.file_path.split("/").pop()}</small></div><button onClick={() => removeMedia(media)} disabled={deletingId === media.id} className="admin-icon-danger">{deletingId === media.id ? <span className="admin-spinner" /> : <Trash2 className="h-4 w-4" />}</button></div>)}{!currentMedia.length && <EmptyState icon={ImagePlus} text="No uploaded asset in this view yet." />}</div></div></div>;
  };

  const renderStudents = () => {
    const list = students.filter((s) => !studentQuery || s.register_number.toLowerCase().includes(studentQuery.toLowerCase()));
    return <div className="space-y-4"><div className="admin-card"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="admin-kicker">Student records</p><h2 className="admin-section-title">Manage register numbers & progress</h2></div><button onClick={exportStudents} className="admin-secondary-btn"><Download className="h-4 w-4" /> Export CSV</button></div><input value={studentQuery} onChange={(e) => setStudentQuery(e.target.value)} placeholder="Search register number…" className="admin-input mt-4" /></div><div className="admin-card overflow-hidden"><div className="divide-y divide-white/10">{list.map((student) => { const done = (student.completed_experiment_ids ?? []).length; const inProgress = Object.values(student.experiment_status ?? {}).filter((x: any) => x === "in_progress").length; const pct = experiments.length ? Math.round(done / experiments.length * 100) : 0; return <div key={student.register_number} className="p-4 flex flex-col lg:flex-row lg:items-center gap-3"><div className="min-w-0 flex-1"><b className="text-sm text-white">{student.register_number}</b><small className="block mt-1 text-[10px] text-zinc-500">Updated {student.updated_at ? new Date(student.updated_at).toLocaleString() : "—"}</small></div><div className="flex items-center gap-3"><div className="w-28 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-[#0a84ff]" style={{ width: `${pct}%` }} /></div><span className="text-[11px] text-zinc-300">{done}/{experiments.length} · {inProgress} active</span><button title="Reset progress" onClick={() => resetStudent(student)} className="admin-icon-danger"><RotateCcw className="h-4 w-4" /></button><button title="Delete student" onClick={() => deleteStudent(student)} className="admin-icon-danger"><UserX className="h-4 w-4" /></button></div></div>; })}{!list.length && <EmptyState icon={Users} text="No matching student records." />}</div></div></div>;
  };

  const renderAnalytics = () => {
    const totalDone = students.reduce((n, s) => n + (s.completed_experiment_ids ?? []).length, 0);
    const average = students.length && experiments.length ? Math.round(totalDone / (students.length * experiments.length) * 100) : 0;
    return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-3"><div className="admin-stat"><Users className="h-4 w-4 text-[#60a5fa]"/><span>Students</span><strong>{students.length}</strong></div><div className="admin-stat"><CheckCircle2 className="h-4 w-4 text-[#4ade80]"/><span>Completed records</span><strong>{totalDone}</strong></div><div className="admin-stat"><BarChart3 className="h-4 w-4 text-[#38bdf8]"/><span>Average progress</span><strong>{average}%</strong></div></div><div className="admin-card"><p className="admin-kicker">Experiment completion</p><h2 className="admin-section-title">Class progress by experiment</h2><div className="mt-5 space-y-3">{experiments.map((exp) => { const done = students.filter((s) => (s.completed_experiment_ids ?? []).includes(exp.id)).length; const pct = students.length ? Math.round(done / students.length * 100) : 0; return <div key={exp.id}><div className="flex justify-between text-[11px]"><span className="text-zinc-300">#{String(exp.expNo).padStart(2,"0")} {exp.title}</span><span className="text-zinc-500">{done}/{students.length} · {pct}%</span></div><div className="mt-1 h-2 rounded-full bg-white/[.06] overflow-hidden"><div className="h-full bg-[#0a84ff] rounded-full" style={{width:`${pct}%`}}/></div></div>; })}</div></div></div>;
  };

  const renderActivity = () => <div className="space-y-4"><div className="admin-card"><div className="flex items-center justify-between"><div><p className="admin-kicker">Audit trail</p><h2 className="admin-section-title">Recent student activity</h2></div><Activity className="h-5 w-5 text-[#60a5fa]"/></div><div className="mt-4 space-y-2">{activity.map((item) => <div key={item.id} className="admin-media-row"><span className="admin-icon-box"><Activity className="h-4 w-4"/></span><div className="min-w-0 flex-1"><b>{item.register_number} · {String(item.action).replaceAll("_", " ")}</b><small>{item.experiment_id ? `Experiment ${item.experiment_id} · ` : ""}{new Date(item.created_at).toLocaleString()}</small></div></div>)}{!activity.length && <EmptyState icon={Activity} text="No activity recorded yet."/>}</div></div></div>;

  const renderSettings = () => <div className="space-y-4"><div className="admin-card"><div className="flex items-center gap-3"><div className="admin-icon-box"><Settings className="h-5 w-5"/></div><div><p className="admin-kicker">Site settings</p><h2 className="admin-section-title">Laboratory identity & notices</h2></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><label><span className="admin-label">College / lab name</span><input value={siteSettings.college_name} onChange={(e)=>setSiteSettings(x=>({...x,college_name:e.target.value}))} className="admin-input mt-2"/></label><label><span className="admin-label">Department</span><input value={siteSettings.department} onChange={(e)=>setSiteSettings(x=>({...x,department:e.target.value}))} className="admin-input mt-2"/></label><label><span className="admin-label">Academic year</span><input value={siteSettings.academic_year} onChange={(e)=>setSiteSettings(x=>({...x,academic_year:e.target.value}))} className="admin-input mt-2" placeholder="2026–27"/></label><label><span className="admin-label">Footer</span><input value={siteSettings.footer_text} onChange={(e)=>setSiteSettings(x=>({...x,footer_text:e.target.value}))} className="admin-input mt-2"/></label></div><label className="block mt-4"><span className="admin-label">Announcement</span><textarea value={siteSettings.announcements[0]?.text ?? ""} onChange={(e)=>setSiteSettings(x=>({...x,announcements:e.target.value ? [{text:e.target.value,updated_at:new Date().toISOString()}] : []}))} className="admin-textarea mt-2" placeholder="Optional notice shown to students."/></label><div className="mt-4 flex justify-end"><button onClick={()=>runConfirmed("Publish site settings?","These identity and notice settings will become visible to students.",()=>void saveSiteSettings(),{confirmLabel:"Publish"})} className="admin-primary-btn"><Megaphone className="h-4 w-4"/> Publish settings</button></div></div><div className="admin-card"><p className="admin-kicker">Student preview</p><h3 className="admin-section-title">Open the student portal</h3><p className="mt-2 text-xs text-zinc-500">Use a new tab to verify the public portal after publishing content.</p><button onClick={()=>window.open(window.location.origin,"_blank")} className="admin-secondary-btn mt-4"><ExternalLink className="h-4 w-4"/> Open student portal</button></div></div>;

  const renderGate = () => <div className="space-y-4"><div className="admin-card"><div className="flex items-center gap-3"><div className="admin-icon-box amber"><AlertTriangle className="h-5 w-5" /></div><div><p className="admin-kicker amber-text">Card gate</p><h2 className="admin-section-title">Caution before opening</h2></div></div><div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[.025] p-4"><div><b className="text-sm text-white">Show verification caution</b><p className="mt-1 text-xs leading-5 text-zinc-500">Students see the caution before the experiment opens.</p></div><button onClick={() => requestSettingChange("cautionEnabled", !settings.cautionEnabled)} className={`admin-switch ${settings.cautionEnabled ? "on" : ""}`}><span /></button></div><label className="mt-4 block"><span className="admin-label">Caution message</span><textarea value={settings.cautionMessage} onChange={(e) => setSettings((x) => ({ ...x, cautionMessage: e.target.value }))} className="admin-textarea mt-2" /></label></div><SaveBar onSave={requestSave} saving={savingEditor} /></div>;

  const visibilityItems: { key: "showHardwarePhoto" | "showSerialMonitor" | "showThingSpeakDashboard" | "showOutputPhoto"; label: string; hint: string }[] = [
    { key: "showHardwarePhoto", label: "Hardware Photo", hint: "Circuit / sensor setup" },
    { key: "showSerialMonitor", label: "Serial Monitor", hint: "Arduino / NodeMCU output" },
    { key: "showThingSpeakDashboard", label: "ThingSpeak Dashboard", hint: "Cloud graph / dashboard" },
    { key: "showOutputPhoto", label: "Output Photo", hint: "Final experiment result" },
  ];
  const renderDisplay = () => <div className="space-y-4"><div className="admin-card"><div className="flex items-center gap-3"><div className="admin-icon-box"><Eye className="h-5 w-5" /></div><div><p className="admin-kicker">Student view</p><h2 className="admin-section-title">Photo visibility</h2><p className="mt-1 text-xs text-zinc-500">Each switch controls one student-facing evidence section.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{visibilityItems.map((item) => <button key={item.key} onClick={() => requestSettingChange(item.key, !settings[item.key])} className="admin-visibility-row"><span><b>{item.label}</b><small>{item.hint}</small></span>{settings[item.key] ? <Eye className="h-4 w-4 text-emerald-300" /> : <EyeOff className="h-4 w-4 text-zinc-600" />}</button>)}</div></div><SaveBar onSave={requestSave} saving={savingEditor} /></div>;

  const renderInspector = () => (
    <aside className="admin-inspector">
      <div className="admin-inspector-head">
        <div><p className="admin-kicker">Workspace</p><h3>Current experiment</h3></div>
        <span className="admin-inspector-dot" />
      </div>
      <div className="admin-current-experiment">
        <span className="admin-exp-number">{String(chosen?.expNo ?? 0).padStart(2, "0")}</span>
        <div className="min-w-0"><b>{chosen?.title ?? "No experiment"}</b><small>{chosen?.category ?? "Select an experiment"}</small></div>
      </div>
      <div className="admin-inspector-meta">
        <Info label="Language" value={chosen?.codeLanguage ?? "—"} />
        <Info label="Code file" value={chosen?.codeFilename ?? "—"} />
      </div>
      <div className="admin-inspector-section">
        <p className="admin-kicker">Quick actions</p>
        <button onClick={() => nav("experiment")} className="admin-inspector-action"><FolderOpen className="h-4 w-4" /> Open record <span>→</span></button>
        <button onClick={() => nav("code")} className="admin-inspector-action"><Code2 className="h-4 w-4" /> Edit program <span>→</span></button>
        <button onClick={() => nav("media")} className="admin-inspector-action"><ImagePlus className="h-4 w-4" /> Manage evidence <span>→</span></button>
        <button onClick={() => nav("gate")} className="admin-inspector-action"><AlertTriangle className="h-4 w-4" /> Card gate <span>→</span></button>
      </div>
      <div className="admin-inspector-section admin-inspector-status">
        <p className="admin-kicker">Live status</p>
        <div><span>Card caution</span><b className={settings.cautionEnabled ? "warn" : "ok"}>{settings.cautionEnabled ? "ENABLED" : "OFF"}</b></div>
        <div><span>Evidence assets</span><b>{existingMedia.length}</b></div>
        <div><span>Components</span><b>{apparatus.length}</b></div>
      </div>
    </aside>
  );

  const content: Record<Page, ReactNode> = { overview: renderOverview(), students: renderStudents(), analytics: renderAnalytics(), activity: renderActivity(), experiment: renderExperiment(), code: renderCode(), components: renderComponents(), media: renderMedia(), gate: renderGate(), display: renderDisplay(), settings: renderSettings() };

  return <section className="admin-workspace">
    {renderHeader()}
    <div className="admin-body">
      <aside className="admin-dock">
        <div className="admin-nav-label">CONTROL</div>
        {(["overview", "students", "analytics", "activity"] as Page[]).map((p) => <PageButton key={p} page={p} active={page === p} onClick={() => nav(p)} />)}
        <div className="admin-nav-label workspace-label">EXPERIMENT</div>
        {(["experiment", "code", "components", "media", "gate", "display"] as Page[]).map((p) => <PageButton key={p} page={p} active={page === p} onClick={() => nav(p)} />)}
        <div className="admin-nav-label workspace-label">SYSTEM</div>
        <PageButton page="settings" active={page === "settings"} onClick={() => nav("settings")} />
      </aside>
      <main className="admin-main">
        <div className="admin-page-heading admin-command-page-heading">
          <div><p className="admin-kicker">{pageMeta[page].label}</p><h2>{pageMeta[page].title}</h2></div>
          <div className="admin-page-status"><span className={settings.cautionEnabled ? "amber" : "green"}>{settings.cautionEnabled ? "Caution ON" : "Caution OFF"}</span><span>{existingMedia.length} assets</span></div>
        </div>
        <div className="admin-workspace-ribbon">
          <div className="admin-workspace-ribbon-title"><span className="admin-ribbon-dot" /> ADMINISTRATOR WORKSPACE</div>
          <div className="admin-ribbon-current"><span>Current experiment</span><b>#{String(chosen?.expNo ?? 0).padStart(2, "0")} · {chosen?.title}</b></div>
          <button onClick={() => setOpen((v) => !v)} className="admin-select"><span>Switch experiment</span><ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} /></button>
        </div>
        {open && <div className="admin-command-picker">{renderExperimentPicker()}</div>}
        {content[page]}
      </main>
      {renderInspector()}
    </div>
    {status && <div className="admin-toast"><CheckCircle2 className="h-4 w-4" />{status}</div>}
    <ConfirmModal state={confirm} onClose={() => setConfirm(null)} />
  </section>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="admin-info"><span>{label}</span><b>{value}</b></div>; }
function SaveBar({ onSave, saving }: { onSave: () => void; saving: boolean }) { return <div className="admin-savebar"><div><b>Unsaved editor changes</b><span>Review them before saving to Supabase.</span></div><button onClick={onSave} disabled={saving} className="admin-primary-btn">{saving ? <span className="admin-spinner" /> : <Save className="h-4 w-4" />}{saving ? "Saving…" : "Save changes"}</button></div>; }
function EmptyState({ icon: Icon, text }: { icon: typeof Box; text: string }) { return <div className="admin-empty"><Icon className="h-5 w-5" /><span>{text}</span></div>; }
function UploadCard({ slot, file, onPick, onUpload, uploading }: { slot: Slot; file: File | null | undefined; onPick: (key: string, e: ChangeEvent<HTMLInputElement>) => void; onUpload: (slot: Slot) => void; uploading: string | null }) { const Icon = slot.icon; return <article className="admin-upload-card"><div className="flex items-start gap-3"><span className="admin-icon-box"><Icon className="h-4 w-4" /></span><div className="min-w-0"><b>{slot.label}</b><small>{slot.hint}</small></div></div><label className="admin-file-picker"><span className="truncate">{file?.name ?? "Choose file"}</span><span>Browse</span><input type="file" accept={accept(slot.type)} onChange={(e) => onPick(slot.key, e)} className="hidden" /></label><button disabled={!file || uploading !== null} onClick={() => onUpload(slot)} className="admin-primary-btn w-full justify-center disabled:opacity-40"><UploadCloud className="h-4 w-4" />{uploading === slot.key ? "Uploading…" : "Upload asset"}</button></article>; }
