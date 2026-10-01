import { AnimatePresence, motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type InspectorAction = { id: string; label: string; icon: LucideIcon };
type InspectorExperiment = { id: string; expNo?: number; title: string; category: string; codeLanguage?: string; codeFilename?: string };

type Props = {
  experiment?: InspectorExperiment;
  cautionEnabled: boolean;
  assets: number;
  components: number;
  actions: InspectorAction[];
  onNavigate: (id: string) => void;
};

function Info({ label, value }: { label: string; value: string }) {
  return <div className="admin-info"><span>{label}</span><b>{value}</b></div>;
}

export function AdminInspector({ experiment, cautionEnabled, assets, components, actions, onNavigate }: Props) {
  return (
    <aside className="av7-inspector">
      <div className="av7-inspector-head">
        <div><p className="admin-kicker">Workspace</p><h3>Current experiment</h3></div>
        <span className="av7-inspector-dot" />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={experiment?.id ?? "none"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.16 }} className="av7-inspector-body">
          <div className="av7-current">
            <span className="av7-exp-no">{String(experiment?.expNo ?? 0).padStart(2, "0")}</span>
            <div><b>{experiment?.title ?? "No experiment"}</b><small>{experiment?.category ?? "Select an experiment"}</small></div>
          </div>
          <div className="av7-meta">
            <Info label="Language" value={experiment?.codeLanguage ?? "—"} />
            <Info label="Code file" value={experiment?.codeFilename ?? "—"} />
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="av7-inspector-section">
        <p className="admin-kicker">Quick actions</p>
        {actions.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => onNavigate(id)} className="av7-inspector-action"><Icon size={16} /><span>{label}</span><ChevronRight size={15} /></button>
        ))}
      </div>
      <div className="av7-inspector-section av7-status">
        <p className="admin-kicker">Live status</p>
        <div><span>Card caution</span><b className={cautionEnabled ? "warn" : "ok"}>{cautionEnabled ? "Enabled" : "Off"}</b></div>
        <div><span>Evidence assets</span><b>{assets}</b></div>
        <div><span>Components</span><b>{components}</b></div>
      </div>
    </aside>
  );
}
