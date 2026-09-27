import { AlertTriangle, ArrowRight, ShieldAlert, X } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  title: string;
  message: string;
  onContinue: () => void;
  onClose: () => void;
}

export function ExperimentCautionModal({ title, message, onContinue, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4">
      <motion.div
        className="fixed inset-0 bg-black/75 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
        className="relative w-full max-w-md overflow-hidden rounded-[26px] border border-amber-300/20 bg-[#171719]/95 text-[#f5f5f7] shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-400/15 text-amber-300 ring-1 ring-amber-300/20">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-amber-300">Verification Notice</p>
              <h2 className="mt-0.5 text-sm font-bold">{title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/5 p-2 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <p className="text-sm leading-6 text-[#e4e4e7]">{message}</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-[#a1a1a6]">
            This notice is controlled from the Admin Panel. After verification, the administrator can turn this notice off.
          </p>
          <button
            onClick={onContinue}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0a84ff] to-[#38bdf8] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/40 transition hover:brightness-110"
          >
            Continue to Experiment <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
