import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Experiment } from '../types/experiment';
import { Check, Sparkles, Circle, ArrowUpRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface MyProgressProps {
  experiments: Experiment[];
  completedIds: Set<string>;
  onToggleComplete: (id: string) => void;
  onSelectExperiment: (exp: Experiment) => void;
}

export const MyProgress = ({
  experiments,
  completedIds,
  onToggleComplete,
  onSelectExperiment,
}: MyProgressProps) => {
  const [filter, setFilter] = useState<'all' | 'remaining' | 'completed'>('all');
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  const completedCount = completedIds.size;
  const totalCount = experiments.length;
  const remainingCount = totalCount - completedCount;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Ring geometry
  const ringRadius = 44;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  const handleToggle = (id: string, isCurrentlyDone: boolean) => {
    if (!isCurrentlyDone) {
      setJustCompletedId(id);
      setTimeout(() => setJustCompletedId(null), 1200);
    }
    onToggleComplete(id);
  };

  const filteredExperiments = experiments.filter((exp) => {
    const isDone = completedIds.has(exp.id);
    if (filter === 'completed') return isDone;
    if (filter === 'remaining') return !isDone;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto space-y-6 pb-20"
    >
      {/* Top Header */}
      <div className="text-center sm:text-left space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
          Student Companion &amp; Tracker
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f5f5f7]">
          IIOT Laboratory Progress
        </h1>
        <p className="text-xs sm:text-sm text-[#a1a1a6]">
          Track your progress through all 29 industrial IoT practical experiments. Changes are saved automatically.
        </p>
      </div>

      {/* Premium iOS-Style Progress Card with Circular Ring & Metric Counters */}
      <div className="macos-glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#0a84ff]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left: Metrics & Overview */}
          <div className="flex-1 w-full space-y-5 text-center sm:text-left">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Metric 1: Total */}
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-[#a1a1a6] uppercase tracking-wider">
                  Total
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#f5f5f7] font-mono mt-1">
                  29
                </span>
                <span className="text-[10px] text-[#71717a] mt-0.5">Experiments</span>
              </div>

              {/* Metric 2: Completed */}
              <div className="bg-[#30d158]/10 border border-[#30d158]/20 rounded-2xl p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-[#4ade80] uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-3 h-3" /> Completed
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#4ade80] font-mono mt-1">
                  {completedCount}
                </span>
                <span className="text-[10px] text-[#4ade80]/70 mt-0.5">Finished</span>
              </div>

              {/* Metric 3: Remaining */}
              <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-2xl p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-[#fbbf24] uppercase tracking-wider flex items-center gap-1">
                  <Circle className="w-2.5 h-2.5" /> Remaining
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#fbbf24] font-mono mt-1">
                  {remainingCount}
                </span>
                <span className="text-[10px] text-[#fbbf24]/70 mt-0.5">Pending</span>
              </div>

              {/* Metric 4: Percentage */}
              <div className="bg-[#0a84ff]/10 border border-[#0a84ff]/20 rounded-2xl p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-[#38bdf8] uppercase tracking-wider">
                  Complete
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#38bdf8] font-mono mt-1">
                  {progressPercentage}%
                </span>
                <span className="text-[10px] text-[#38bdf8]/70 mt-0.5">Overall Status</span>
              </div>
            </div>

            {/* Horizontal Linear Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full h-3 bg-white/[0.08] rounded-full overflow-hidden p-0.5 shadow-inner border border-white/[0.05]">
                <motion.div
                  initial={false}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ type: 'spring', stiffness: 140, damping: 22, mass: 0.8 }}
                  className="h-full macos-btn-gradient rounded-full shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#a1a1a6] px-1">
                <span>
                  {completedCount === totalCount ? (
                    <span className="inline-flex items-center gap-1 text-[#4ade80] font-bold">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                      All 29 experiments completed! Record ready for evaluation.
                    </span>
                  ) : (
                    <span>
                      <strong className="text-[#f5f5f7]">{remainingCount}</strong> experiments remaining to complete
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-[#71717a]">Per-user state</span>
              </div>
            </div>
          </div>

          {/* Right: iOS Activity Progress Ring */}
          <div className="shrink-0 flex flex-col items-center justify-center p-3 bg-white/[0.03] rounded-3xl border border-white/10">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={ringRadius}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Animated Progress Ring */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r={ringRadius}
                  stroke="url(#ring-gradient)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  initial={false}
                  animate={{ strokeDashoffset }}
                  transition={{ type: 'spring', stiffness: 140, damping: 22 }}
                  strokeLinecap="round"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0a84ff" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#30d158" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inner Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-[#f5f5f7] font-mono leading-none">
                  {progressPercentage}%
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#a1a1a6] mt-0.5">
                  Done
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#a1a1a6] mt-2">
              {completedCount} of {totalCount} Done
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
        {/* iOS-Style Pill Switcher */}
        <div className="relative flex items-center bg-white/[0.08] p-1 rounded-2xl border border-white/10 w-full sm:w-auto">
          {(['all', 'completed', 'remaining'] as const).map((tabKey) => {
            const isSelected = filter === tabKey;
            const count =
              tabKey === 'all'
                ? totalCount
                : tabKey === 'completed'
                ? completedCount
                : remainingCount;

            const label =
              tabKey === 'all'
                ? 'All Experiments'
                : tabKey === 'completed'
                ? 'Completed'
                : 'Remaining';

            return (
              <motion.button
                key={tabKey}
                onClick={() => setFilter(tabKey)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className={`relative z-10 flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                  isSelected ? 'text-white' : 'text-[#a1a1a6] hover:text-[#f5f5f7]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="progress-tab-indicator"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className="absolute inset-0 bg-white/15 rounded-xl shadow-xs border border-white/15"
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  {tabKey === 'completed' && <Check className="w-3 h-3 text-[#4ade80]" />}
                  {tabKey === 'remaining' && <Circle className="w-2.5 h-2.5 text-[#fbbf24]" />}
                  <span>{label}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
                    {count}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>

        <span className="text-xs text-[#a1a1a6] hidden sm:block">
          Tap an experiment to view complete details
        </span>
      </div>

      {/* iOS-Style Experiment Rows */}
      <div className="macos-glass-card rounded-3xl overflow-hidden divide-y divide-white/[0.06] border border-white/10 shadow-lg">
        {filteredExperiments.length === 0 ? (
          <div className="p-12 text-center text-[#a1a1a6] space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-[#a1a1a6]/50" />
            <p className="text-sm font-semibold text-[#f5f5f7]">
              {filter === 'completed'
                ? 'No experiments marked completed yet.'
                : 'All experiments have been marked complete!'}
            </p>
            <p className="text-xs text-[#71717a]">
              Toggle checkboxes on each row to record your laboratory progress.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredExperiments.map((exp) => {
              const isDone = completedIds.has(exp.id);
              const isHighlighted = justCompletedId === exp.id;

              return (
                <motion.div
                  key={exp.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    backgroundColor: isHighlighted
                      ? [
                          'rgba(48, 209, 88, 0.28)',
                          'rgba(10, 132, 255, 0.16)',
                          'rgba(255, 255, 255, 0)',
                        ]
                      : 'rgba(255, 255, 255, 0)',
                  }}
                  transition={{
                    backgroundColor: { duration: 1.1, ease: 'easeOut' },
                    layout: { type: 'spring', stiffness: 350, damping: 28 },
                    opacity: { duration: 0.2 },
                  }}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.04] transition-colors group cursor-pointer"
                  onClick={() => onSelectExperiment(exp)}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    {/* Bouncy Spring Checkbox Button */}
                    <motion.button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(exp.id, isDone);
                      }}
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.82 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors duration-200 shrink-0 cursor-pointer ${
                        isDone
                          ? 'bg-[#30d158] border-[#30d158] text-white shadow-sm shadow-[#30d158]/40'
                          : 'border-white/30 hover:border-[#0a84ff] bg-white/[0.04]'
                      }`}
                      title={isDone ? 'Mark as Remaining' : 'Mark as Completed'}
                    >
                      <AnimatePresence mode="wait">
                        {isDone ? (
                          <motion.div
                            key="check-icon"
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </motion.div>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-[#0a84ff]" />
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {/* Experiment Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#a1a1a6]">
                          #{String(exp.expNo).padStart(2, '0')}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] text-[#a1a1a6] font-semibold border border-white/10">
                          {exp.categoryShort || exp.category}
                        </span>
                      </div>

                      {/* Title styled per iOS requirement: ✓ Experiment Name / ○ Experiment Name */}
                      <h4
                        className={`text-sm sm:text-base font-bold tracking-tight truncate mt-0.5 transition-colors group-hover:text-[#38bdf8] flex items-center gap-1.5 ${
                          isDone ? 'text-[#a1a1a6] line-through opacity-80' : 'text-[#f5f5f7]'
                        }`}
                      >
                        <span className="shrink-0 text-xs font-mono">
                          {isDone ? '✓' : '○'}
                        </span>
                        <span className="truncate">{exp.title}</span>
                      </h4>
                    </div>
                  </div>

                  {/* Right Status Badge & Arrow */}
                  <div className="shrink-0 flex items-center gap-2">
                    <motion.span
                      layout
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full ${
                        isDone
                          ? 'bg-[#30d158]/20 text-[#4ade80] border border-[#30d158]/30'
                          : 'bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/30'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-2.5 h-2.5" />
                          <span>Remaining</span>
                        </>
                      )}
                    </motion.span>

                    <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-[#a1a1a6] group-hover:bg-[#0a84ff] group-hover:text-white transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};
