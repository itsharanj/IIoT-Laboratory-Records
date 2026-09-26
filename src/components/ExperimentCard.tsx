import { motion, Variants } from 'motion/react';
import { Experiment } from '../types/experiment';
import { PencilSketchDiagram } from './PencilSketchDiagram';
import { generateExperimentPDF } from '../utils/pdfExport';
import {
  ArrowUpRight,
  Cpu,
  Cloud,
  Smartphone,
  Network,
  Globe,
  Radio,
  Code2,
  FileCheck2,
  FileDown,
} from 'lucide-react';

interface ExperimentCardProps {
  experiment: Experiment;
  onClick: () => void;
  isCompleted?: boolean;
}

export const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 26,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.14 },
  },
  hover: {
    y: -6,
    scale: 1.025,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 24,
      mass: 0.8,
    },
  },
  tap: {
    scale: 0.96,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25,
    },
  },
};

const diagramThumbnailVariants: Variants = {
  hidden: { scale: 1 },
  visible: { scale: 1 },
  exit: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

function getCategoryIcon(categoryShort: string, category: string) {
  if (categoryShort === 'Basic I/O & Sensors' || category.includes('Basic GPIO')) {
    return <Cpu className="w-4 h-4 text-[#60a5fa]" />;
  }
  if (categoryShort === 'ThingSpeak' || category.includes('ThingSpeak')) {
    return <Cloud className="w-4 h-4 text-[#38bdf8]" />;
  }
  if (categoryShort === 'Blynk' || category.includes('Blynk')) {
    return <Smartphone className="w-4 h-4 text-[#34d399]" />;
  }
  if (categoryShort === 'Packet Tracer' || category.includes('Packet Tracer')) {
    return <Network className="w-4 h-4 text-[#fbbf24]" />;
  }
  if (categoryShort === 'Web Server' || category.includes('Web Server')) {
    return <Globe className="w-4 h-4 text-[#a78bfa]" />;
  }
  if (categoryShort === 'Arduino Cloud & Voice' || category.includes('Voice')) {
    return <Radio className="w-4 h-4 text-[#f472b6]" />;
  }
  return <Cpu className="w-4 h-4 text-[#60a5fa]" />;
}

function getCategoryBadge(categoryShort: string, category: string) {
  if (categoryShort === 'Basic I/O & Sensors' || category.includes('Basic GPIO')) {
    return 'bg-[#0a84ff]/15 text-[#60a5fa] border-[#0a84ff]/30';
  }
  if (categoryShort === 'ThingSpeak' || category.includes('ThingSpeak')) {
    return 'bg-[#0284c7]/15 text-[#38bdf8] border-[#0284c7]/30';
  }
  if (categoryShort === 'Blynk' || category.includes('Blynk')) {
    return 'bg-[#10b981]/15 text-[#34d399] border-[#10b981]/30';
  }
  if (categoryShort === 'Packet Tracer' || category.includes('Packet Tracer')) {
    return 'bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30';
  }
  if (categoryShort === 'Web Server' || category.includes('Web Server')) {
    return 'bg-[#8b5cf6]/15 text-[#a78bfa] border-[#8b5cf6]/30';
  }
  if (categoryShort === 'Arduino Cloud & Voice' || category.includes('Voice')) {
    return 'bg-[#ec4899]/15 text-[#f472b6] border-[#ec4899]/30';
  }
  return 'bg-white/10 text-[#f5f5f7] border-white/15';
}

export const ExperimentCard = ({
  experiment,
  onClick,
  isCompleted,
}: ExperimentCardProps) => {
  const shortCategory = experiment.categoryShort || experiment.category;
  const hasCode = Boolean(experiment.code && experiment.code.trim().length > 0);
  const hasResult = Boolean(
    experiment.conclusion && experiment.conclusion.trim().length > 0
  );

  return (
    <motion.div
      variants={cardItemVariants}
      layout
      layoutId={`card-container-${experiment.id}`}
      onClick={onClick}
      whileHover="hover"
      whileTap="tap"
      className="group text-left macos-glass-card rounded-3xl p-6 cursor-pointer flex flex-col justify-between relative overflow-hidden select-none"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2 min-w-0">
            <motion.span
              whileHover={{ rotate: 8, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center shrink-0"
            >
              {getCategoryIcon(shortCategory, experiment.category)}
            </motion.span>
            <span
              className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border truncate ${getCategoryBadge(
                shortCategory,
                experiment.category
              )}`}
              title={experiment.category}
            >
              {shortCategory}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isCompleted && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#30d158]/20 text-[#4ade80] border border-[#30d158]/30">
                Completed
              </span>
            )}
            <span className="text-xs font-mono font-bold text-[#a1a1a6] group-hover:text-[#38bdf8] transition-colors">
              #{String(experiment.expNo).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Hand-Drawn Pencil-Sketch Circuit Diagram Thumbnail */}
        <div className="w-full h-48 rounded-xl bg-black/40 border border-white/10 mb-4 overflow-hidden flex items-center justify-center relative shadow-inner group-hover:border-white/20 transition-colors">
          <motion.div
            variants={diagramThumbnailVariants}
            className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-xl p-1"
          >
            <PencilSketchDiagram
              apparatus={experiment.apparatus}
              category={experiment.category}
              title={experiment.title}
              expNo={experiment.expNo}
              className="w-full h-full"
            />
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-[17px] font-bold text-[#f5f5f7] tracking-tight group-hover:text-[#38bdf8] transition-colors leading-snug">
          {experiment.title}
        </h3>

        {/* Aim snippet */}
        <p className="text-xs text-[#a1a1a6] line-clamp-3 mt-2 leading-relaxed">
          {experiment.aim}
        </p>

        {/* Status Placeholders Chips */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {/* Code Status */}
          {hasCode ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#30d158]/15 text-[#4ade80] border border-[#30d158]/25">
              <Code2 className="w-3 h-3" /> Code Ready
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.04] text-[#a1a1a6] border border-dashed border-white/15">
              <Code2 className="w-3 h-3 opacity-60" /> Code not added yet
            </span>
          )}

          {/* Result Status */}
          {hasResult ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0a84ff]/15 text-[#60a5fa] border border-[#0a84ff]/25">
              <FileCheck2 className="w-3 h-3" /> Result Ready
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.04] text-[#a1a1a6] border border-dashed border-white/15">
              <FileCheck2 className="w-3 h-3 opacity-60" /> Result not added yet
            </span>
          )}
        </div>
      </div>

      {/* Quick Look & Download Actions */}
      <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-[#a1a1a6]">
        {/* Direct Download Complete Record */}
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            generateExperimentPDF(experiment);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 450, damping: 22 }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-[#0a84ff]/20 text-[#a1a1a6] hover:text-[#38bdf8] border border-white/10 hover:border-[#0a84ff]/30 transition-colors text-[11px] cursor-pointer"
          title="Download Complete Record (PDF)"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Record PDF</span>
        </motion.button>

        <div className="flex items-center gap-1.5 group-hover:text-[#38bdf8] transition-colors">
          <span>Quick Look</span>
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
            className="w-7 h-7 rounded-full bg-white/[0.08] border border-white/10 group-hover:bg-[#0a84ff] group-hover:text-white flex items-center justify-center shadow-xs transition-colors duration-200"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
