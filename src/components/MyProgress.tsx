import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Circle, Clock3, Sparkles, ArrowUpRight } from 'lucide-react';
import type { Experiment } from '../types/experiment';
import type { ExperimentStatus, ExperimentStatusMap } from '../lib/studentProgress';

interface Props {
  experiments: Experiment[];
  completedIds: Set<string>;
  statusMap: ExperimentStatusMap;
  onToggleComplete: (id: string) => void;
  onSetStatus: (id: string, status: ExperimentStatus) => void;
  onSelectExperiment: (exp: Experiment) => void;
}

const sections = [
  { key: 'Basic I/O & Sensors', label: 'Normal I/O Experiments', range: '01–10' },
  { key: 'ThingSpeak', label: 'ThingSpeak', range: '11–16' },
  { key: 'Packet Tracer', label: 'Cisco Packet Tracer', range: '17–20' },
  { key: 'Blynk', label: 'Blynk', range: '21–24' },
  { key: 'Web Server', label: 'Web Server', range: '25–27' },
  { key: 'Arduino Cloud & Voice', label: 'Arduino IoT Cloud', range: '28–29' },
];

function sectionFor(exp: Experiment) {
  return sections.find((s) => s.key === exp.categoryShort)?.key ?? 'Arduino Cloud & Voice';
}

export const MyProgress = ({ experiments, completedIds, statusMap, onToggleComplete, onSetStatus, onSelectExperiment }: Props) => {
  const [filter, setFilter] = useState<'all' | 'remaining' | 'completed'>('all');
  const completedCount = completedIds.size;
  const totalCount = experiments.length;
  const remainingCount = totalCount - completedCount;
  const progress = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const grouped = useMemo(() => sections.map((section) => ({ ...section, items: experiments.filter((e) => sectionFor(e) === section.key && (filter === 'all' || (filter === 'completed' ? completedIds.has(e.id) : !completedIds.has(e.id)))) })).filter((s) => s.items.length), [experiments, filter, completedIds]);

  const cycleStatus = (id: string) => {
    const current = statusMap[id] || (completedIds.has(id) ? 'completed' : 'not_started');
    const next: ExperimentStatus = current === 'not_started' ? 'in_progress' : current === 'in_progress' ? 'completed' : 'not_started';
    onSetStatus(id, next);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-6 pb-20">
      <header className="text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-[.16em] text-[#38bdf8]">Student Companion & Tracker</span>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight">My Progress</h1>
        <p className="mt-1 text-xs sm:text-sm text-[#a1a1a6]">Your experiment status is saved against your register number.</p>
      </header>

      <section className="macos-glass-card rounded-3xl p-5 sm:p-7 overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Metric label="Total" value={totalCount} tone="neutral" />
          <Metric label="Completed" value={completedCount} tone="green" />
          <Metric label="In Progress" value={Object.values(statusMap).filter((s) => s === 'in_progress').length} tone="amber" />
          <Metric label="Complete" value={`${progress}%`} tone="blue" />
        </div>
        <div className="mt-5 h-3 rounded-full bg-white/[.07] border border-white/[.05] overflow-hidden"><motion.div initial={false} animate={{ width: `${progress}%` }} className="h-full rounded-full macos-btn-gradient" /></div>
        <div className="mt-2 flex justify-between text-[11px] text-[#71717a]"><span>{remainingCount} experiments remaining</span><span>{completedCount}/{totalCount}</span></div>
      </section>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'remaining', 'completed'] as const).map((value) => <button key={value} onClick={() => setFilter(value)} className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition ${filter === value ? 'bg-[#0a84ff] border-[#0a84ff] text-white' : 'bg-white/[.04] border-white/10 text-[#a1a1a6] hover:text-white'}`}>{value === 'all' ? 'All experiments' : value === 'remaining' ? 'Pending' : 'Completed'}</button>)}
        </div>
        <span className="text-[11px] text-[#71717a]">Tap status to cycle: Not started → In progress → Completed</span>
      </div>

      <div className="space-y-8">
        {grouped.map((section) => (
          <section key={section.key}>
            <div className="flex items-end justify-between gap-3 mb-3 px-1">
              <div><p className="text-[10px] uppercase tracking-[.18em] font-bold text-[#60a5fa]">Experiments {section.range}</p><h2 className="mt-1 text-lg sm:text-xl font-bold">{section.label}</h2></div>
              <span className="text-xs text-[#71717a]">{section.items.filter((e) => completedIds.has(e.id)).length}/{section.items.length} complete</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {section.items.map((exp) => {
                const status = statusMap[exp.id] || (completedIds.has(exp.id) ? 'completed' : 'not_started');
                return <motion.article key={exp.id} whileHover={{ y: -3 }} className="macos-glass-card rounded-2xl p-4 flex flex-col gap-3 min-w-0">
                  <div className="flex items-start justify-between gap-2"><div><span className="text-[10px] font-mono text-[#71717a]">#{String(exp.expNo).padStart(2, '0')}</span><h3 className="mt-1 text-sm font-bold leading-snug">{exp.title}</h3></div><button onClick={() => cycleStatus(exp.id)} title="Change status" className={`shrink-0 grid place-items-center w-9 h-9 rounded-xl border ${status === 'completed' ? 'bg-[#30d158]/15 border-[#30d158]/25 text-[#4ade80]' : status === 'in_progress' ? 'bg-[#f59e0b]/15 border-[#f59e0b]/25 text-[#fbbf24]' : 'bg-white/[.04] border-white/10 text-[#71717a]'}`}>{status === 'completed' ? <Check className="w-4 h-4" /> : status === 'in_progress' ? <Clock3 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}</button></div>
                  <p className="text-[11px] text-[#8f8f96] line-clamp-2 leading-relaxed">{exp.aim}</p>
                  <div className="mt-auto flex items-center justify-between gap-2"><span className={`text-[10px] font-semibold ${status === 'completed' ? 'text-[#4ade80]' : status === 'in_progress' ? 'text-[#fbbf24]' : 'text-[#71717a]'}`}>{status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In progress' : 'Not started'}</span><button onClick={() => onSelectExperiment(exp)} className="inline-flex items-center gap-1 text-[10px] font-bold text-[#60a5fa] hover:text-white">Open <ArrowUpRight className="w-3 h-3" /></button></div>
                </motion.article>;
              })}
            </div>
          </section>
        ))}
      </div>
      {completedCount === totalCount && totalCount > 0 && <div className="text-center py-6 text-[#4ade80] font-semibold text-sm"><Sparkles className="inline w-4 h-4 mr-1" /> All experiments completed. Record ready for evaluation.</div>}
    </motion.div>
  );
};

function Metric({ label, value, tone }: { label: string; value: string | number; tone: 'neutral' | 'green' | 'amber' | 'blue' }) {
  const classes = { neutral: 'text-[#f5f5f7]', green: 'text-[#4ade80]', amber: 'text-[#fbbf24]', blue: 'text-[#38bdf8]' }[tone];
  return <div className="rounded-2xl border border-white/10 bg-white/[.035] p-3.5"><span className="text-[10px] uppercase tracking-wider text-[#71717a] font-semibold">{label}</span><strong className={`block mt-1 text-2xl sm:text-3xl font-black font-mono ${classes}`}>{value}</strong></div>;
}
