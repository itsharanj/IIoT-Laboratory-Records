import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Props = { label: string; description: string; icon: LucideIcon; onClick: () => void };

export function AdminQuickAction({ label, description, icon: Icon, onClick }: Props) {
  return (
    <motion.button type="button" onClick={onClick} className="av7-quick" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.16 }}>
      <span className="av7-quick-icon"><Icon size={17} /></span>
      <span className="av7-quick-text"><b>{label}</b><small>{description}</small></span>
      <ChevronRight size={16} className="av7-quick-arrow" />
    </motion.button>
  );
}
