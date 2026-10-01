/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Experiment } from './types/experiment';
import { INITIAL_EXPERIMENTS } from './data/experiments';
import { Navigation } from './components/Navigation';
import { ExperimentsGrid } from './components/ExperimentsGrid';
import { ExperimentDetailModal } from './components/ExperimentDetailModal';
import { MyProgress } from './components/MyProgress';
import { ExperimentCatalogue } from './components/ExperimentCatalogue';
import { LabAssistant } from './components/LabAssistant';
import { ExperimentCautionModal } from './components/ExperimentCautionModal';
import { loadExperimentOverrides, mergeExperimentOverrides } from './lib/experimentOverrides';
import { supabase } from './lib/supabase';
import { loadStudentProgress, saveStudentProgress, logStudentActivity, type ExperimentStatus, type ExperimentStatusMap } from './lib/studentProgress';

const STORAGE_KEY_PROGRESS = 'iiot_lab_completed_experiments_v5';

interface AppProps {
  studentRegisterNumber: string;
  studentName?: string;
  studentSupporter?: boolean;
  onStudentLogout: () => void;
}

export default function App({ studentRegisterNumber, studentName = 'Student', studentSupporter = false, onStudentLogout }: AppProps) {
  const [experiments, setExperiments] = useState<Experiment[]>(INITIAL_EXPERIMENTS);
  const [activeTab, setActiveTab] = useState<'experiments' | 'progress'>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash === 'progress' ? 'progress' : 'experiments';
  });
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('exp=')) {
      return INITIAL_EXPERIMENTS.find((e) => e.id === hash.replace('exp=', '')) || null;
    }
    return null;
  });
  const [pendingExperiment, setPendingExperiment] = useState<Experiment | null>(null);
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [statusMap, setStatusMap] = useState<ExperimentStatusMap>({});
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressSaving, setProgressSaving] = useState(false);
  const [progressError, setProgressError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowWelcome(false), 3200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let active = true;
    setProgressLoading(true);
    loadStudentProgress(studentRegisterNumber)
      .then((record) => {
        if (!active) return;
        const completed = record.completed_experiment_ids || [];
        setCompletedIds(new Set(completed));
        const loadedStatuses = { ...(record.experiment_status || {}) } as ExperimentStatusMap;
        for (const id of completed) loadedStatuses[id] = 'completed';
        setStatusMap(loadedStatuses);
        setProgressError('');
      })
      .catch((error) => {
        if (!active) return;
        setProgressError(error instanceof Error ? error.message : 'Could not load saved progress.');
        try {
          const saved = localStorage.getItem(`${STORAGE_KEY_PROGRESS}:${studentRegisterNumber}`);
          if (saved) setCompletedIds(new Set(JSON.parse(saved)));
        } catch {}
      })
      .finally(() => { if (active) setProgressLoading(false); });

    return () => { active = false; };
  }, [studentRegisterNumber]);

  useEffect(() => {
    let active = true;
    if (supabase) supabase.from('lab_settings').select('announcements').eq('id', 'default').maybeSingle().then(({ data }) => {
      if (!active) return;
      const first = Array.isArray(data?.announcements) ? data.announcements[0] : null;
      setAnnouncement(typeof first?.text === 'string' ? first.text : '');
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    loadExperimentOverrides().then((overrides) => {
      if (!active) return;
      const merged = mergeExperimentOverrides(INITIAL_EXPERIMENTS, overrides);
      setExperiments(merged);
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('exp=')) {
        setSelectedExperiment(merged.find((e) => e.id === hash.replace('exp=', '')) || null);
      }
    });
    return () => { active = false; };
  }, []);

  const persistProgress = (ids: Set<string>, statuses: ExperimentStatusMap) => {
    const completed = Array.from(ids);
    try { localStorage.setItem(`${STORAGE_KEY_PROGRESS}:${studentRegisterNumber}`, JSON.stringify(completed)); } catch {}
    setProgressSaving(true);
    setProgressError('');
    saveStudentProgress(studentRegisterNumber, completed, statuses)
      .catch((error) => setProgressError(error instanceof Error ? error.message : 'Progress could not be saved.'))
      .finally(() => setProgressSaving(false));
  };

  const setExperimentStatus = (id: string, status: ExperimentStatus) => {
    setStatusMap((prev) => {
      const next = { ...prev, [id]: status };
      setCompletedIds((completedPrev) => {
        const completed = new Set(completedPrev);
        if (status === 'completed') completed.add(id); else completed.delete(id);
        persistProgress(completed, next);
        void logStudentActivity(studentRegisterNumber, status === 'completed' ? 'completed_experiment' : 'updated_progress', id, { status });
        return completed;
      });
      return next;
    });
  };

  const toggleComplete = (id: string) => {
    setExperimentStatus(id, completedIds.has(id) ? 'not_started' : 'completed');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (pendingExperiment) setPendingExperiment(null);
        else if (selectedExperiment) handleCloseDetail();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedExperiment, pendingExperiment]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'progress') {
        setActiveTab('progress');
        setSelectedExperiment(null);
      } else if (hash.startsWith('exp=')) {
        const found = experiments.find((e) => e.id === hash.replace('exp=', ''));
        if (found) setSelectedExperiment(found);
      } else {
        setActiveTab('experiments');
        setSelectedExperiment(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [experiments]);

  const handleTabChange = (tab: 'experiments' | 'progress') => {
    setActiveTab(tab);
    if (tab === 'progress') window.location.hash = 'progress';
    else window.history.pushState(null, '', window.location.pathname);
    setSelectedExperiment(null);
  };

  const openExperiment = (exp: Experiment) => {
    setSelectedExperiment(exp);
    window.location.hash = `exp=${exp.id}`;
  };

  const handleSelectExperiment = (exp: Experiment) => {
    if (exp.settings?.cautionEnabled) {
      setPendingExperiment(exp);
      return;
    }
    openExperiment(exp);
  };

  const handleCloseDetail = () => {
    setSelectedExperiment(null);
    if (activeTab === 'progress') window.location.hash = 'progress';
    else window.history.pushState(null, '', window.location.pathname);
  };

  const currentIndex = selectedExperiment
    ? experiments.findIndex((e) => e.id === selectedExperiment.id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < experiments.length - 1;

  const handleNavigatePrev = () => {
    if (hasPrev) {
      const exp = experiments[currentIndex - 1];
      if (exp.settings?.cautionEnabled) setPendingExperiment(exp);
      else openExperiment(exp);
    }
  };

  const handleNavigateNext = () => {
    if (hasNext) {
      const exp = experiments[currentIndex + 1];
      if (exp.settings?.cautionEnabled) setPendingExperiment(exp);
      else openExperiment(exp);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-[#f5f5f7] relative overflow-hidden bg-[#000000]">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-[#0a84ff]/16 via-[#1e3a8a]/12 to-transparent blur-[120px]" />
        <div className="absolute top-[25%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#38bdf8]/12 via-[#0ea5e9]/10 to-transparent blur-[140px]" />
        <div className="absolute -bottom-[20%] left-[15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-[#0284c7]/12 via-[#0f172a]/20 to-transparent blur-[130px]" />
      </div>

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="fixed inset-0 z-[100] pointer-events-none grid place-items-center bg-[#05080d]/70 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 240, damping: 24 }}
              className="rounded-[28px] border border-[#38bdf8]/20 bg-[#08121c]/92 px-10 py-8 text-center shadow-2xl iiot-blue-glow"
            >
              <p className="text-[11px] uppercase tracking-[.24em] font-black text-[#38bdf8]">IIoT LABORATORY RECORD</p>
              <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-white">Welcome back, {studentName} 👋</h1>
              <p className="mt-3 text-sm text-[#91a7b8]">Your practical record is ready.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          completedCount={completedIds.size}
          totalCount={experiments.length}
          onOpenCatalogue={() => setCatalogueOpen(true)}
          studentRegisterNumber={studentRegisterNumber}
          studentName={studentName}
          studentSupporter={studentSupporter}
          onStudentLogout={onStudentLogout}
        />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
          {announcement && <div className="mb-4 rounded-2xl border border-[#0a84ff]/20 bg-[#0a84ff]/10 px-4 py-3 text-xs text-[#bfdbfe]"><span className="font-bold text-[#60a5fa]">Lab Notice · </span>{announcement}</div>}
          {(progressLoading || progressSaving || progressError) && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs">
              <span className="text-[#a1a1a6]">{progressLoading ? 'Loading your saved progress…' : progressSaving ? 'Saving your progress…' : `Progress sync issue: ${progressError}`}</span>
              <span className="font-mono text-[#60a5fa]">{studentRegisterNumber}</span>
            </div>
          )}
          <AnimatePresence mode="wait">
            {activeTab === 'experiments' ? (
              <motion.div key="tab-experiments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: 'spring', stiffness: 360, damping: 28 }}>
                <ExperimentsGrid experiments={experiments} onSelectExperiment={handleSelectExperiment} completedIds={completedIds} />
              </motion.div>
            ) : (
              <motion.div key="tab-progress" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: 'spring', stiffness: 360, damping: 28 }}>
                <MyProgress experiments={experiments} completedIds={completedIds} statusMap={statusMap} onToggleComplete={toggleComplete} onSetStatus={setExperimentStatus} onSelectExperiment={handleSelectExperiment} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="no-print py-8 text-center text-xs text-[#a1a1a6] border-t border-white/[0.08] mt-auto">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>IIoT Laboratory Record · 29 Industrial IoT Experiments</span>
            <span className="text-[#71717a]">© GPTI · Made by SharanJ</span>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {selectedExperiment && (
          <ExperimentDetailModal
            experiment={selectedExperiment}
            onClose={handleCloseDetail}
            onNavigatePrev={handleNavigatePrev}
            onNavigateNext={handleNavigateNext}
            hasPrev={hasPrev}
            hasNext={hasNext}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingExperiment && (
          <ExperimentCautionModal
            title={pendingExperiment.title}
            message={pendingExperiment.settings?.cautionMessage || "This experiment is not done yet. Please verify it by yourself. Once completed and verified, the administrator can update this status."}
            onClose={() => setPendingExperiment(null)}
            onContinue={() => {
              const exp = pendingExperiment;
              setPendingExperiment(null);
              openExperiment(exp);
            }}
          />
        )}
      </AnimatePresence>

      {catalogueOpen && <ExperimentCatalogue onClose={() => setCatalogueOpen(false)} />}
      <LabAssistant />
    </div>
  );
}
