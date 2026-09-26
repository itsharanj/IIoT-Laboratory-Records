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

const STORAGE_KEY_PROGRESS = 'iiot_lab_completed_experiments_v4';

export default function App() {
  // 1. Navigation Tab State: 'experiments' | 'progress'
  const [activeTab, setActiveTab] = useState<'experiments' | 'progress'>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'progress') return 'progress';
    return 'experiments';
  });

  // 2. Selected Experiment for Quick Look Modal
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('exp=')) {
      const expId = hash.replace('exp=', '');
      return INITIAL_EXPERIMENTS.find((e) => e.id === expId) || null;
    }
    return null;
  });
  const [catalogueOpen, setCatalogueOpen] = useState(false);

  // 3. Completed Experiment IDs for "My Progress" (persisted in localStorage)
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return new Set(parsed);
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
    // Default initial progress: empty by default per requirement
    return new Set<string>();
  });

  // Sync state to localStorage whenever completedIds changes
  const toggleComplete = (id: string) => {
    setCompletedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      try {
        localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(Array.from(updated)));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  // Keyboard shortcut: Esc to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedExperiment) {
        handleCloseDetail();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedExperiment]);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'progress') {
        setActiveTab('progress');
        setSelectedExperiment(null);
      } else if (hash.startsWith('exp=')) {
        const expId = hash.replace('exp=', '');
        const found = INITIAL_EXPERIMENTS.find((e) => e.id === expId);
        if (found) {
          setSelectedExperiment(found);
        }
      } else {
        setActiveTab('experiments');
        setSelectedExperiment(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: 'experiments' | 'progress') => {
    setActiveTab(tab);
    if (tab === 'progress') {
      window.location.hash = 'progress';
    } else {
      window.history.pushState(null, '', window.location.pathname);
    }
    setSelectedExperiment(null);
  };

  const handleSelectExperiment = (exp: Experiment) => {
    setSelectedExperiment(exp);
    window.location.hash = `exp=${exp.id}`;
  };

  const handleCloseDetail = () => {
    setSelectedExperiment(null);
    if (activeTab === 'progress') {
      window.location.hash = 'progress';
    } else {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  // Next / Previous experiment navigation inside Quick Look modal
  const currentIndex = selectedExperiment
    ? INITIAL_EXPERIMENTS.findIndex((e) => e.id === selectedExperiment.id)
    : -1;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < INITIAL_EXPERIMENTS.length - 1;

  const handleNavigatePrev = () => {
    if (hasPrev) {
      handleSelectExperiment(INITIAL_EXPERIMENTS[currentIndex - 1]);
    }
  };

  const handleNavigateNext = () => {
    if (hasNext) {
      handleSelectExperiment(INITIAL_EXPERIMENTS[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-[#f5f5f7] relative overflow-hidden bg-[#000000]">
      {/* macOS Dark Mode Ambient Blurred Wallpaper Blobs (Deep Blue, Violet & Graphite) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-[#0a84ff]/16 via-[#1e3a8a]/12 to-transparent blur-[120px]" />
        <div className="absolute top-[25%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#7c3aed]/12 via-[#312e81]/10 to-transparent blur-[140px]" />
        <div className="absolute -bottom-[20%] left-[15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-[#0284c7]/12 via-[#0f172a]/20 to-transparent blur-[130px]" />
      </div>

      {/* Floating Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* macOS Toolbar Navigation */}
        <Navigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          completedCount={completedIds.size}
          totalCount={INITIAL_EXPERIMENTS.length}
          onOpenCatalogue={() => setCatalogueOpen(true)}
        />

        {/* Main View Area with Tab Transition */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
          <AnimatePresence mode="wait">
            {activeTab === 'experiments' ? (
              <motion.div
                key="tab-experiments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              >
                <ExperimentsGrid
                  experiments={INITIAL_EXPERIMENTS}
                  onSelectExperiment={handleSelectExperiment}
                  completedIds={completedIds}
                />
              </motion.div>
            ) : (
              <motion.div
                key="tab-progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              >
                <MyProgress
                  experiments={INITIAL_EXPERIMENTS}
                  completedIds={completedIds}
                  onToggleComplete={toggleComplete}
                  onSelectExperiment={handleSelectExperiment}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Minimal macOS Dark Footer */}
        <footer className="no-print py-8 text-center text-xs text-[#a1a1a6] border-t border-white/[0.08] mt-auto">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>IIoT Laboratory Record · 29 Industrial IoT Experiments</span>
            <span className="text-[#71717a]">© GPTI · Made by SharanJ</span>
          </div>
        </footer>
      </div>

      {/* Quick Look Expanded Card Modal with Shared Layout Animation */}
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
      {catalogueOpen && <ExperimentCatalogue onClose={() => setCatalogueOpen(false)} />}
      <LabAssistant />
    </div>
  );
}
