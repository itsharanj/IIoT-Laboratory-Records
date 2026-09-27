import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { Experiment } from '../types/experiment';
import { CodeBlock } from './CodeBlock';
import { PencilSketchDiagram } from './PencilSketchDiagram';
import { ImageLightboxModal } from './ImageLightboxModal';
import { ExperimentPhotosModal } from './ExperimentPhotosModal';
import { TutorialVideoModal } from './TutorialVideoModal';
import { supabase } from '../lib/supabase';
import { generateExperimentPDF, downloadCodeFile, downloadImageFile } from '../utils/pdfExport';
import {
  resolveExperimentPhotos,
  getExperimentPhotoItems,
  NormalizedPhoto,
} from '../utils/photoManager';
import {
  X,
  FileDown,
  Download,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Code2,
  Info,
  Camera,
  Play,
  Video,
  Router,
  Laptop,
  Server,
  Network,
  Wifi,
  Cpu,
  Cable,
  Terminal,
  Cloud,
  Database,
  Globe,
} from 'lucide-react';

function getSoftwareComponentIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('laptop') || n.includes('pc')) return <Laptop className="w-3.5 h-3.5 text-[#38bdf8]" />;
  if (n.includes('wireless router') || n.includes('gateway')) return <Wifi className="w-3.5 h-3.5 text-[#f59e0b]" />;
  if (n.includes('router')) return <Router className="w-3.5 h-3.5 text-[#fbbf24]" />;
  if (n.includes('switch')) return <Network className="w-3.5 h-3.5 text-[#34d399]" />;
  if (n.includes('dhcp')) return <Database className="w-3.5 h-3.5 text-[#10b981]" />;
  if (n.includes('dns')) return <Globe className="w-3.5 h-3.5 text-[#6366f1]" />;
  if (n.includes('server')) return <Server className="w-3.5 h-3.5 text-[#a855f7]" />;
  if (n.includes('access point')) return <Wifi className="w-3.5 h-3.5 text-[#38bdf8]" />;
  if (n.includes('iot')) return <Cpu className="w-3.5 h-3.5 text-[#ec4899]" />;
  if (n.includes('ethernet')) return <Cable className="w-3.5 h-3.5 text-[#60a5fa]" />;
  if (n.includes('console')) return <Terminal className="w-3.5 h-3.5 text-[#a1a1aa]" />;
  if (n.includes('cloud') || n.includes('internet')) return <Cloud className="w-3.5 h-3.5 text-[#38bdf8]" />;
  return <Cpu className="w-3.5 h-3.5 text-[#38bdf8]" />;
}

interface ExperimentDetailModalProps {
  experiment: Experiment;
  onClose: () => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

const modalContentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.22, // Wait for card frame to finish expanding smoothly
      staggerChildren: 0.055, // 55ms cascade between each lab sheet section
    },
  },
};

const modalSectionVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 360,
      damping: 26,
    },
  },
};

export const ExperimentDetailModal = ({
  experiment,
  onClose,
  onNavigatePrev,
  onNavigateNext,
  hasPrev,
  hasNext,
}: ExperimentDetailModalProps) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [availablePhotos, setAvailablePhotos] = useState<NormalizedPhoto[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [zoomedTitle, setZoomedTitle] = useState<string>('Preview');
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [previewPdf, setPreviewPdf] = useState<{ title: string; url: string } | null>(null);
  const [uploadedMedia, setUploadedMedia] = useState<{ id: string; title: string; media_type: 'image' | 'video' | 'pdf'; file_path: string; url: string }[]>([]);

  useEffect(() => {
    let isMounted = true;
    resolveExperimentPhotos(experiment).then((verified) => {
      if (isMounted) {
        setAvailablePhotos(verified);
        setActivePhotoIndex(0);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [experiment]);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.from('experiment_media').select('id, title, media_type, file_path').eq('experiment_id', experiment.id).order('created_at', { ascending: false }).then(({ data }) => {
      if (!active) return;
      setUploadedMedia((data ?? []).map((item) => ({ ...item, media_type: item.media_type as 'image' | 'video' | 'pdf', url: supabase.storage.from('experiment-media').getPublicUrl(item.file_path).data.publicUrl })));
    });
    return () => { active = false; };
  }, [experiment.id]);

  const isPacketTracer =
    experiment.categoryShort === 'Packet Tracer' ||
    experiment.category.toLowerCase().includes('packet tracer');
  const uploadedTutorialUrl = uploadedMedia.find(item => item.media_type === 'video')?.url;
  const uploadedPdfs = uploadedMedia.filter(item => item.media_type === 'pdf');
  const tutorialUrl = uploadedTutorialUrl || experiment.tutorialVideoUrl;
  const hasTutorialVideo = Boolean(tutorialUrl && tutorialUrl.trim().length > 0);
  const hasCode = Boolean(!isPacketTracer && experiment.code && experiment.code.trim().length > 0);
  const settings = {
    showHardwarePhoto: true,
    showSerialMonitor: true,
    showThingSpeakDashboard: true,
    showOutputPhoto: true,
    ...(experiment.settings ?? {}),
  };
  const visibleLocalPhotos = settings.showHardwarePhoto ? availablePhotos : [];
  const isUploadedPhotoVisible = (title: string) => {
    const normalized = title.toLowerCase();
    if (normalized.includes('hardware')) return settings.showHardwarePhoto;
    if (normalized.includes('serial')) return settings.showSerialMonitor;
    if (normalized.includes('thingspeak')) return settings.showThingSpeakDashboard;
    if (normalized.includes('output') || normalized.includes('simulation')) return settings.showOutputPhoto;
    return true;
  };
  const visibleUploadedImages = uploadedMedia.filter(
    item => item.media_type === 'image' && isUploadedPhotoVisible(item.title),
  );
  const hasPhotos = visibleLocalPhotos.length > 0 || visibleUploadedImages.length > 0;
  const currentPhoto = visibleLocalPhotos.length > 0 ? visibleLocalPhotos[Math.min(activePhotoIndex, visibleLocalPhotos.length - 1)] : null;
  const modalPhotos = [
    ...getExperimentPhotoItems(experiment, visibleLocalPhotos),
    ...visibleUploadedImages.map(item => ({
      title: item.title,
      image: item.url,
      downloadUrl: item.url,
      description: 'Uploaded by administrator',
      category: 'Lab Upload',
    })),
  ];

  const handleDownloadPDF = async () => {
    try {
      setIsPdfGenerating(true);
      generateExperimentPDF(experiment);
    } finally {
      setTimeout(() => setIsPdfGenerating(false), 800);
    }
  };

  const handleDownloadCode = () => {
    if (!hasCode) return;
    const filename = experiment.codeFilename || `Exp_${String(experiment.expNo).padStart(2, '0')}_Code.ino`;
    downloadCodeFile(experiment.code, filename);
  };

  const handleDownloadCurrentImage = () => {
    if (hasPhotos && currentPhoto) {
      const filename = `Exp_${String(experiment.expNo).padStart(2, '0')}_Photo_${activePhotoIndex + 1}.jpg`;
      downloadImageFile(currentPhoto.url, filename);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-1.5 sm:p-6">
      {/* Blurred Dimmed Backdrop with slightly delayed graceful fade */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md"
      />

      {/* Shared Layout Card — morphs from the clicked card into this Quick Look modal */}
      <motion.div
        layoutId={`card-container-${experiment.id}`}
        transition={{
          type: 'spring',
          stiffness: 340,
          damping: 28,
          mass: 0.85,
        }}
        className="relative z-10 macos-glass-modal text-[#f5f5f7] w-full max-w-4xl max-h-[96vh] rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-white/15"
      >
        {/* macOS Window Title Bar Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 macos-glass-nav border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Close Button with Spring Press */}
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.16] active:bg-white/[0.24] text-[#f5f5f7] flex items-center justify-center transition-colors cursor-pointer border border-white/10"
              title="Close Quick Look (Esc)"
            >
              <X className="w-4 h-4" />
            </motion.button>

            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#38bdf8]">
                Experiment #{String(experiment.expNo).padStart(2, '0')}
              </span>
              <h2 className="text-sm font-bold text-[#f5f5f7] line-clamp-1">
                {experiment.title}
              </h2>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-white/[0.08] p-0.5 rounded-full border border-white/10">
              <motion.button
                type="button"
                onClick={onNavigatePrev}
                disabled={!hasPrev}
                whileHover={{ scale: hasPrev ? 1.08 : 1 }}
                whileTap={{ scale: hasPrev ? 0.94 : 1 }}
                transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#f5f5f7] hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                title="Previous Experiment"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                type="button"
                onClick={onNavigateNext}
                disabled={!hasNext}
                whileHover={{ scale: hasNext ? 1.08 : 1 }}
                whileTap={{ scale: hasNext ? 0.94 : 1 }}
                transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#f5f5f7] hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                title="Next Experiment"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Networking Tutorial Button for Cisco Packet Tracer */}
            {isPacketTracer && (
              hasTutorialVideo ? (
                <motion.button
                  type="button"
                  onClick={() => setIsTutorialModalOpen(true)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] hover:brightness-110 rounded-full shadow-md transition-all cursor-pointer border border-white/20"
                  title="Open Networking Tutorial"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Tutorial</span>
                </motion.button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#a1a1aa] bg-white/[0.05] border border-white/10 rounded-full cursor-not-allowed select-none opacity-70"
                  title="Tutorial video coming soon"
                >
                  <Video className="w-3.5 h-3.5 text-[#a1a1aa]" />
                  <span>Tutorial coming soon</span>
                </button>
              )
            )}

            {/* Download Full Experiment as PDF Button with Spring Press */}
            <motion.button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isPdfGenerating}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white macos-btn-gradient rounded-full shadow-md hover:brightness-105 transition-all cursor-pointer disabled:opacity-50"
              title="Export complete experiment record as PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isPdfGenerating ? 'Exporting...' : 'Download PDF'}</span>
            </motion.button>
          </div>
        </div>

        {/* Scrollable Content Body with Staggered Cascading Sections */}
        <motion.div
          variants={modalContentVariants}
          initial="hidden"
          animate="visible"
          className="overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8 flex-1 custom-scrollbar"
        >
          {/* Header Metadata */}
          <motion.div variants={modalSectionVariants} className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#0a84ff]/20 text-[#60a5fa] border border-[#0a84ff]/30">
                {experiment.category}
              </span>
              <span className="text-xs font-mono text-[#a1a1a6]">
                Experiment No. {experiment.expNo}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[#f5f5f7] tracking-tight leading-snug">
              {experiment.title}
            </h1>
          </motion.div>

          {/* 1. AIM / OBJECTIVE */}
          <motion.section variants={modalSectionVariants} className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#a1a1a6] px-1">
              1. Aim &amp; Objective
            </h3>
            <div className="macos-glass-card rounded-2xl p-5 sm:p-6 text-sm sm:text-base text-[#f5f5f7] leading-relaxed font-medium">
              {experiment.aim}
            </div>
          </motion.section>

          {/* 2. APPARATUS / COMPONENTS */}
          <motion.section variants={modalSectionVariants} className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#a1a1a6] px-1">
              2. Apparatus &amp; Software Required
            </h3>
            <div className="macos-glass-card rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-white/[0.05] text-[#a1a1a6] font-bold uppercase tracking-wider border-b border-white/[0.08]">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">Sl.</th>
                      <th className="py-3 px-4">Component / Hardware / Tool</th>
                      <th className="py-3 px-4">Specifications</th>
                      <th className="py-3 px-4 text-right">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {experiment.apparatus.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-3 px-4 text-center font-mono text-xs text-[#a1a1a6]">
                          {item.slNo || idx + 1}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#f5f5f7]">{item.name}</td>
                        <td className="py-3 px-4 text-[#a1a1a6]">{item.specs}</td>
                        <td className="py-3 px-4 text-right font-medium text-[#f5f5f7]">
                          {item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* CISCO PACKET TRACER: SOFTWARE COMPONENTS USED */}
          {isPacketTracer && experiment.softwareComponents && experiment.softwareComponents.length > 0 && (
            <motion.section variants={modalSectionVariants} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#a1a1a6]">
                  Software Components Used
                </h3>
                <span className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#fbbf24]/15 text-[#fbbf24] border border-[#fbbf24]/25">
                  Cisco Packet Tracer Architecture
                </span>
              </div>
              <div className="macos-glass-card rounded-2xl p-4 sm:p-5">
                <div className="flex flex-wrap gap-2.5">
                  {experiment.softwareComponents.map((comp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all text-xs font-semibold text-[#f5f5f7] shadow-xs"
                    >
                      {getSoftwareComponentIcon(comp)}
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* 3. PROCEDURE */}
          <motion.section variants={modalSectionVariants} className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#a1a1a6] px-1">
              3. Procedure
            </h3>
            <div className="macos-glass-card rounded-2xl p-5 sm:p-6 text-sm sm:text-base text-[#d4d4d8] leading-relaxed whitespace-pre-line font-normal">
              {experiment.procedure || experiment.theory}
            </div>
          </motion.section>

          {/* 4. CIRCUIT DIAGRAM */}
          <motion.section variants={modalSectionVariants} className="space-y-3">
            <div className="flex items-center justify-between px-1 flex-wrap gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#a1a1a6]">
                4. Circuit Diagram
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#0a84ff]/15 text-[#38bdf8] border border-[#0a84ff]/25">
                  Hand-Drawn Block Schematic
                </span>
                {isPacketTracer && (
                  hasTutorialVideo ? (
                    <motion.button
                      type="button"
                      onClick={() => setIsTutorialModalOpen(true)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] hover:brightness-110 rounded-full shadow-xs cursor-pointer border border-white/20"
                      title="Watch Networking Tutorial"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Tutorial</span>
                    </motion.button>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[#a1a1aa] bg-white/[0.05] border border-white/10 rounded-full cursor-not-allowed select-none opacity-60"
                      title="Tutorial video coming soon"
                    >
                      <Video className="w-3 h-3 text-[#a1a1aa]" />
                      <span>Tutorial coming soon</span>
                    </span>
                  )
                )}
                <motion.button
                  type="button"
                  onClick={() => setIsPhotosModalOpen(true)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#f5f5f7] bg-white/[0.08] hover:bg-white/[0.14] rounded-full transition-colors cursor-pointer border border-white/15 shadow-xs"
                  title="View experiment photos"
                >
                  <Camera className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Photos</span>
                  {modalPhotos && modalPhotos.length > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-mono bg-[#0a84ff]/25 text-[#38bdf8] rounded-full font-bold">
                      {modalPhotos.length}
                    </span>
                  )}
                </motion.button>
              </div>
            </div>

            <div className="macos-glass-card rounded-2xl p-4 overflow-hidden space-y-3">
              <div className="relative group bg-black/40 rounded-xl border border-white/10 p-2 flex items-center justify-center">
                <PencilSketchDiagram
                  apparatus={experiment.apparatus}
                  category={experiment.category}
                  title={experiment.title}
                  expNo={experiment.expNo}
                  className="w-full"
                />
              </div>
              <div className="px-2 flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#f5f5f7]">
                    Hand-Drawn Circuit Architecture &amp; Wiring
                  </p>
                  <p className="text-xs text-[#a1a1a6] mt-0.5">
                    Signal wiring, pin mapping, and data flow for {experiment.title}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* CONNECTIONS SECTION */}
          {experiment.connections && experiment.connections.length > 0 && (
            <motion.section variants={modalSectionVariants} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#a1a1a6]">
                  Connections &amp; Pin Configuration
                </h3>
                <span className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#0a84ff]/15 text-[#38bdf8] border border-[#0a84ff]/25">
                  Hardware Wiring
                </span>
              </div>
              <div className="macos-glass-card rounded-2xl p-4 sm:p-5 space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  {experiment.connections.map((conn, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#0a84ff] shrink-0 shadow-[0_0_8px_rgba(10,132,255,0.7)]" />
                      <span className="font-mono text-xs sm:text-sm text-[#f5f5f7] tracking-wide">
                        {conn}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* 5. CODE SECTION */}
          {!isPacketTracer && (
            <motion.section variants={modalSectionVariants} className="space-y-3">
              <div className="flex items-center justify-between px-1 flex-wrap gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#a1a1a6]">
                  5. Program Source Code
                </h3>

                <div className="flex items-center gap-2">
                  {/* Photos Button */}
                  <motion.button
                    type="button"
                    onClick={() => setIsPhotosModalOpen(true)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#f5f5f7] bg-white/[0.08] hover:bg-white/[0.14] rounded-full transition-colors cursor-pointer border border-white/15 hover:border-[#0a84ff]/40 shadow-xs"
                    title="View and download experiment photos"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Photos</span>
                    {modalPhotos && modalPhotos.length > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-mono bg-[#0a84ff]/25 text-[#38bdf8] rounded-full font-bold">
                        {modalPhotos.length}
                      </span>
                    )}
                  </motion.button>

                  {uploadedPdfs.length > 0 && (
                    <motion.button
                      type="button"
                      onClick={() => setPreviewPdf({ title: uploadedPdfs[0].title, url: uploadedPdfs[0].url })}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#f5f5f7] bg-white/[0.08] hover:bg-white/[0.14] rounded-full transition-colors cursor-pointer border border-white/15 hover:border-[#0a84ff]/40 shadow-xs"
                      title="Preview uploaded experiment PDF"
                    >
                      <FileDown className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>Preview PDF</span>
                    </motion.button>
                  )}

                  {hasCode ? (
                    <motion.button
                      type="button"
                      onClick={handleDownloadCode}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#38bdf8] bg-[#0a84ff]/15 hover:bg-[#0a84ff]/25 rounded-full transition-colors cursor-pointer border border-[#0a84ff]/30"
                      title="Download source code file"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Code</span>
                    </motion.button>
                  ) : (
                    <span className="text-[11px] font-medium text-[#a1a1a6] bg-white/[0.04] px-2.5 py-1 rounded-full border border-dashed border-white/15">
                      Code Pending
                    </span>
                  )}
                </div>
              </div>

              {hasCode ? (
                <CodeBlock
                  code={experiment.code}
                  language={experiment.codeLanguage || 'cpp'}
                  filename={experiment.codeFilename}
                />
              ) : (
                <div className="macos-glass-card rounded-2xl p-6 text-center border border-dashed border-white/20 space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-2xl bg-[#0a84ff]/15 text-[#38bdf8] flex items-center justify-center border border-[#0a84ff]/25">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#f5f5f7]">Code not added yet</p>
                    <p className="text-xs text-[#a1a1a6] mt-1 max-w-md mx-auto leading-relaxed">
                      This experiment&apos;s source code field is waiting for your code. As soon as you paste your program into <code className="font-mono text-[11px] bg-white/[0.08] px-1.5 py-0.5 rounded text-[#38bdf8]">src/data/experiments.ts</code>, it will automatically render here with syntax highlighting and download options.
                    </p>
                  </div>
                </div>
              )}
            </motion.section>
          )}


          {/* 6. RESULT */}
          <motion.section variants={modalSectionVariants} className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#a1a1a6] px-1">
              6. Result
            </h3>
            <div className="bg-[#0a84ff]/10 border border-[#0a84ff]/30 rounded-2xl p-5 sm:p-6 text-sm sm:text-base text-[#f5f5f7] leading-relaxed">
              {experiment.conclusion}
            </div>
          </motion.section>
        </motion.div>

        {/* Modal Footer Bar */}
        <div className="px-4 sm:px-8 py-3 sm:py-4 macos-glass-nav border-t border-white/10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2 text-[#a1a1a6]">
            <Info className="w-4 h-4 text-[#38bdf8]" />
            <span className="hidden sm:inline">Press Esc or click outside to dismiss</span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={handleDownloadPDF}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white macos-btn-gradient rounded-full shadow-md hover:brightness-105 transition-all cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download Complete Record (PDF)</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Lightbox Modal for Zoomed Preview */}
      <ImageLightboxModal
        isOpen={Boolean(zoomedImage)}
        imageUrl={zoomedImage}
        imageTitle={zoomedTitle}
        onClose={() => setZoomedImage(null)}
      />

      {/* Experiment Photos Modal */}
      <ExperimentPhotosModal
        isOpen={isPhotosModalOpen}
        onClose={() => setIsPhotosModalOpen(false)}
        experimentTitle={experiment.title}
        expNo={experiment.expNo}
        category={experiment.category}
        photos={modalPhotos}
        settings={settings}
      />

      <AnimatePresence>
        {previewPdf && (
          <motion.div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-2 sm:p-6 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#151518] shadow-2xl" initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }}>
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5"><p className="truncate text-sm font-bold text-[#f5f5f7]">{previewPdf.title}</p><button type="button" onClick={() => setPreviewPdf(null)} className="rounded-full bg-white/10 p-2 text-[#f5f5f7] hover:bg-white/20" title="Close PDF preview"><X className="h-4 w-4" /></button></div>
              <iframe title={previewPdf.title} src={previewPdf.url} className="min-h-0 flex-1 bg-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cisco Packet Tracer Tutorial Video Modal */}
      {isPacketTracer && (
        <TutorialVideoModal
          isOpen={isTutorialModalOpen}
          onClose={() => setIsTutorialModalOpen(false)}
          videoUrl={tutorialUrl}
          experimentTitle={experiment.title}
          expNo={experiment.expNo}
        />
      )}
    </div>
  );
};
