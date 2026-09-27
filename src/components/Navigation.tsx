import { useState } from 'react';
import { motion } from 'motion/react';
import { Layers, CheckCircle2, Cpu, LifeBuoy, Mail, Phone, X, LogOut, UserRound } from 'lucide-react';

interface NavigationProps {
  activeTab: 'experiments' | 'progress';
  onTabChange: (tab: 'experiments' | 'progress') => void;
  completedCount: number;
  totalCount: number;
  onOpenCatalogue?: () => void;
  studentRegisterNumber: string;
  studentName: string;
  studentSupporter?: boolean;
  onStudentLogout: () => void;
}

export const Navigation = ({
  activeTab,
  onTabChange,
  completedCount,
  totalCount,
  onOpenCatalogue,
  studentRegisterNumber,
  studentName,
  studentSupporter = false,
  onStudentLogout,
}: NavigationProps) => {
  const [supportOpen, setSupportOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 w-full macos-glass-nav transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / macOS Traffic Icon */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 6 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#0a84ff] to-[#38bdf8] text-white flex items-center justify-center shadow-lg shadow-[#0a84ff]/30 cursor-pointer"
          >
            <Cpu className="w-4.5 h-4.5" />
          </motion.div>
          <div>
            <span className="font-bold text-sm sm:text-base text-[#f5f5f7] tracking-tight block leading-tight">
              IIoT Laboratory Record
            </span>
            <span className="text-[11px] text-[#a1a1a6] font-medium hidden sm:block leading-tight">
              29 Industrial IoT Experiments
            </span>
          </div>
        </div>

        {/* macOS Floating Segmented Control with Shared Spring Pill */}
        <div className="relative flex items-center bg-white/[0.08] p-1 rounded-full backdrop-blur-xl border border-white/10 shadow-inner">
          <motion.button
            type="button"
            onClick={() => onTabChange('experiments')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors duration-200 cursor-pointer ${
              activeTab === 'experiments' ? 'text-white' : 'text-[#a1a1a6] hover:text-[#f5f5f7]'
            }`}
          >
            {activeTab === 'experiments' && (
              <motion.div
                layoutId="segmented-tab"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 bg-white/15 rounded-full shadow-sm border border-white/15"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#0a84ff]" />
              <span>Experiments</span>
            </span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => onTabChange('progress')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors duration-200 cursor-pointer ${
              activeTab === 'progress' ? 'text-white' : 'text-[#a1a1a6] hover:text-[#f5f5f7]'
            }`}
          >
            {activeTab === 'progress' && (
              <motion.div
                layoutId="segmented-tab"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 bg-white/15 rounded-full shadow-sm border border-white/15"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0a84ff]" />
              <span>My Progress</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#0a84ff]/20 text-[#60a5fa] rounded-full border border-[#0a84ff]/30">
                {completedCount}/{totalCount}
              </span>
            </span>
          </motion.button>
        </div>

        {/* Student greeting */}
        <div className="hidden lg:flex items-center gap-2 min-w-0">
          <div className="min-w-0 text-right">
            <p className="text-[10px] uppercase tracking-[.16em] font-bold text-[#60a5fa]">Welcome back</p>
            <p className="truncate max-w-44 text-sm font-bold text-white">{studentName} 👋</p>
          </div>
          {studentSupporter && (
            <span className="shrink-0 rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-[10px] font-black tracking-[.16em] text-amber-200">SUPPORTER</span>
          )}
        </div>

        {/* Right Status */}
        <div className="hidden md:flex items-center gap-2 text-xs text-[#a1a1a6] relative">
          <button
            type="button"
            onClick={() => setSupportOpen((value) => !value)}
            className="flex items-center gap-2 rounded-full border border-[#0a84ff]/40 bg-[#0a84ff]/10 px-3 py-1.5 font-semibold text-[#93c5fd] hover:bg-[#0a84ff]/20 transition-colors cursor-pointer"
          >
            <LifeBuoy className="w-3.5 h-3.5" /> Support
          </button>
          {supportOpen && (
            <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-[#0a84ff]/30 bg-[#151518] p-4 text-left shadow-2xl">
              <div className="flex items-center justify-between">
                <p className="font-bold text-white">Support & reports</p>
                <button onClick={() => setSupportOpen(false)} className="text-[#a1a1a6] hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <p className="mt-2 text-[11px] font-bold tracking-[.1em] text-[#60a5fa]">FREE TO ASK SUPPORT AND REPORT ANYTHING</p>
              <a href="tel:7975141961" className="mt-4 flex items-center gap-2 text-sm text-[#f5f5f7] hover:text-[#60a5fa]"><Phone className="w-4 h-4 text-[#60a5fa]" /> 7975141961</a>
              <a href="mailto:sharanj2008@gmail.com" className="mt-2 flex items-center gap-2 text-sm text-[#f5f5f7] hover:text-[#60a5fa]"><Mail className="w-4 h-4 text-[#60a5fa]" /> sharanj2008@gmail.com</a>
            </div>
          )}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
            <UserRound className="w-3.5 h-3.5 text-[#60a5fa]" />
            <span className="text-[11px] font-mono font-semibold text-[#d1d1d6]">{studentRegisterNumber}</span>
            <button type="button" onClick={onStudentLogout} title="Student logout" className="ml-1 rounded-full p-1 text-[#a1a1a6] hover:bg-white/10 hover:text-white transition">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenCatalogue}
            title="Open all experiments"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-medium text-[#f5f5f7] hover:border-[#0a84ff]/60 hover:bg-[#0a84ff]/10 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#30d158] shadow-sm shadow-emerald-400/60 animate-pulse"></span>
            <span>{totalCount} Experiments</span>
          </button>
        </div>
      </div>
    </header>
  );
};
