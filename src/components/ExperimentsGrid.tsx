import { useState, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { Experiment } from '../types/experiment';
import { ExperimentCard } from './ExperimentCard';
import { Search, X, SearchX } from 'lucide-react';

interface ExperimentsGridProps {
  experiments: Experiment[];
  onSelectExperiment: (exp: Experiment) => void;
  completedIds: Set<string>;
}

export interface SectionTab {
  id: string;
  label: string;
  categoryMatch: string;
}

export const SECTION_TABS: SectionTab[] = [
  {
    id: 'ALL',
    label: 'All',
    categoryMatch: 'ALL',
  },
  {
    id: 'sec-1',
    label: 'Basic I/O & Sensors',
    categoryMatch: 'Section 1: Basic GPIO & Sensor Interfacing (Standalone NodeMCU)',
  },
  {
    id: 'sec-2',
    label: 'ThingSpeak',
    categoryMatch: 'Section 2: ThingSpeak Cloud IoT Experiments',
  },
  {
    id: 'sec-3',
    label: 'Packet Tracer',
    categoryMatch: 'Section 3: Cisco Packet Tracer IoT Simulations',
  },
  {
    id: 'sec-4',
    label: 'Blynk',
    categoryMatch: 'Section 4: Blynk IoT Experiments',
  },
  {
    id: 'sec-5',
    label: 'Web Server',
    categoryMatch: 'Section 5: Web Server Based IoT Projects',
  },
  {
    id: 'sec-6',
    label: 'Arduino Cloud & Voice',
    categoryMatch: 'Section 6: Arduino IoT Cloud & Voice Assistant Integration',
  },
];

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // 50ms staggered delay between each card cascade
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
};

export const ExperimentsGrid = ({
  experiments,
  onSelectExperiment,
  completedIds,
}: ExperimentsGridProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('ALL');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Active section tab object
  const activeTab = useMemo(
    () => SECTION_TABS.find((t) => t.id === selectedSectionId) || SECTION_TABS[0],
    [selectedSectionId]
  );

  // Filter experiments
  const filtered = useMemo(() => {
    return experiments.filter((exp) => {
      const matchSection =
        activeTab.categoryMatch === 'ALL' || exp.category === activeTab.categoryMatch;

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchSection;

      const cleanQuery = query.replace(/[-\s_]/g, '');
      const cleanExpId = exp.id.toLowerCase().replace(/[-\s_]/g, '');
      const paddedExpNo = String(exp.expNo).padStart(2, '0');

      const matchId =
        exp.id.toLowerCase().includes(query) ||
        cleanExpId.includes(cleanQuery) ||
        String(exp.expNo) === query ||
        paddedExpNo === query ||
        `exp${exp.expNo}`.includes(cleanQuery) ||
        `exp#${exp.expNo}`.includes(cleanQuery);

      const matchTitle = exp.title.toLowerCase().includes(query);

      const matchQuery =
        matchTitle ||
        matchId ||
        exp.aim.toLowerCase().includes(query) ||
        exp.category.toLowerCase().includes(query) ||
        Boolean(exp.categoryShort && exp.categoryShort.toLowerCase().includes(query));

      const matchCompletion = completionFilter === 'all' || (completionFilter === 'completed' ? completedIds.has(exp.id) : !completedIds.has(exp.id));
      return matchSection && matchQuery && matchCompletion;
    });
  }, [experiments, searchQuery, activeTab, completionFilter, completedIds]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
      className="space-y-8 pb-16"
    >
      {/* Search & Category Filter Header */}
      <div className="space-y-4">
        {/* macOS Search Bar to filter experiments by title or ID */}
        <div className="max-w-xl mx-auto relative">
          <label htmlFor="experiment-search-input" className="sr-only">
            Search experiments by title or ID
          </label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#a1a1a6]">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="experiment-search-input"
            type="search"
            role="searchbox"
            aria-label="Filter experiments by title or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search experiments by title or ID..."
            className="w-full pl-11 pr-10 py-3 text-sm macos-glass-card rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#0a84ff]/25 text-[#f5f5f7] placeholder:text-[#a1a1a6] transition-all"
          />
          {searchQuery && (
            <motion.button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#a1a1a6] hover:text-[#f5f5f7] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Section Tabs with iOS/macOS Pill Slider */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap px-2">
          {SECTION_TABS.map((tab) => {
            const isSelected = selectedSectionId === tab.id;
            const count =
              tab.categoryMatch === 'ALL'
                ? experiments.length
                : experiments.filter((e) => e.category === tab.categoryMatch).length;

            return (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => setSelectedSectionId(tab.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 cursor-pointer select-none ${
                  isSelected
                    ? 'text-white'
                    : 'text-[#a1a1a6] hover:text-[#f5f5f7] macos-glass-pill hover:bg-white/10'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="category-active-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                    className="absolute inset-0 macos-btn-gradient rounded-full shadow-md"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold transition-colors ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white/[0.08] text-[#a1a1a6]'
                    }`}
                  >
                    {count}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 px-2">
          {(['all', 'completed', 'pending'] as const).map((filter) => (
            <button key={filter} type="button" onClick={() => setCompletionFilter(filter)} className={`min-h-10 rounded-full px-4 text-xs font-semibold transition-colors ${completionFilter === filter ? 'bg-[#0a84ff] text-white' : 'bg-white/[0.06] text-[#a1a1a6] hover:bg-white/[0.12]'}`}>
              {filter === 'all' ? 'All records' : filter === 'completed' ? 'Completed' : 'Pending'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Experiment Cards with Staggered Cascading Entrance */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="macos-glass rounded-3xl p-10 sm:p-12 text-center max-w-md mx-auto border border-white/10 flex flex-col items-center shadow-xl"
          >
            {/* Neutral Icon Container */}
            <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-[#a1a1a6] mb-4 shadow-inner">
              <SearchX className="w-7 h-7 stroke-[1.6]" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[#f5f5f7]">No results found</h3>
            <p className="text-xs sm:text-sm text-[#a1a1a6] mt-1.5 leading-relaxed max-w-xs">
              {searchQuery
                ? `We couldn't find any experiments matching "${searchQuery}". Try checking your spelling or searching by title or ID.`
                : 'No experiments found in this section.'}
            </p>

            <div className="flex items-center gap-2 mt-5">
              {searchQuery && (
                <motion.button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  className="px-4 py-2 text-xs font-semibold text-white macos-btn-gradient rounded-full shadow-md transition-all cursor-pointer"
                >
                  Clear Search
                </motion.button>
              )}
              <motion.button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSectionId('ALL');
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                className="px-4 py-2 text-xs font-semibold text-[#a1a1a6] hover:text-[#f5f5f7] bg-white/[0.06] hover:bg-white/[0.12] rounded-full transition-colors cursor-pointer border border-white/10"
              >
                Reset All Filters
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`grid-${selectedSectionId}-${searchQuery}`}
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((exp) => (
              <ExperimentCard
                key={exp.id}
                experiment={exp}
                onClick={() => onSelectExperiment(exp)}
                isCompleted={completedIds.has(exp.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
