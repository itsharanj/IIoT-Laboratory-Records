import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

type Props = { label: string; value: string | number; icon: LucideIcon; index?: number };

export function AdminStatCard({ label, value, icon: Icon, index = 0 }: Props) {
  return (
    <motion.div className="admin-stat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} transition={{ duration: 0.2, delay: index * 0.04 }}>
      <span className="av7-stat-icon"><Icon size={16} /></span>
      <strong>{value}</strong>
      <span>{label}</span>
    </motion.div>
  );
}
