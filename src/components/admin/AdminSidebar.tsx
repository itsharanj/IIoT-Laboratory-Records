import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

export type NavItem = { id: string; label: string; icon: LucideIcon };
export type NavGroup = { label: string; items: NavItem[] };

export function AdminSidebar({ groups, active, onSelect }: { groups: NavGroup[]; active: string; onSelect: (id: string) => void }) {
  return (
    <nav className="av7-rail" aria-label="Admin sections">
      {groups.map((group) => (
        <div key={group.label} className="av7-rail-group">
          <div className="av7-rail-label">{group.label}</div>
          {group.items.map(({ id, label, icon: Icon }) => {
            const isActive = id === active;
            return (
              <button key={id} type="button" title={label} onClick={() => onSelect(id)} aria-current={isActive ? "page" : undefined} className="av7-rail-item">
                {isActive && <motion.span layoutId="av7-rail-active" className="av7-rail-active" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
                <Icon className="av7-rail-icon" />
                <span className="av7-rail-text">{label}</span>
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
