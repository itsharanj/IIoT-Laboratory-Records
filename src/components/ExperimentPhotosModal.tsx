import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExperimentSettings, PhotoItem } from '../types/experiment';
import { ImageLightboxModal } from './ImageLightboxModal';
import { downloadPhotoFile } from '../utils/pdfExport';
import {
  X,
  Download,
  Camera,
  LayoutDashboard,
  Terminal,
  Eye,
  ChevronDown,
  ChevronUp,
  Monitor,
} from 'lucide-react';

interface ExperimentPhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentTitle: string;
  expNo: number;
  category?: string;
  photos?: PhotoItem[];
  settings?: ExperimentSettings;
}

interface AttachmentCategoryConfig {
  id: 'hardware' | 'dashboard' | 'serial_monitor' | 'software_pic';
  label: string;
  description: string;
  icon: typeof Camera | typeof Monitor;
}

export const ExperimentPhotosModal = ({
  isOpen,
  onClose,
  experimentTitle,
  expNo,
  category = '',
  photos = [],
  settings: experimentSettings,
}: ExperimentPhotosModalProps) => {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewImageTitle, setPreviewImageTitle] = useState<string>('');
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  // Esc key listener to close modal or sub-preview
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (previewImageUrl) {
          setPreviewImageUrl(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, previewImageUrl]);

  if (!isOpen) return null;

  // Detect whether this is a Cisco Packet Tracer experiment
  const isPacketTracer =
    (Boolean(category) && category.toLowerCase().includes('packet tracer')) ||
    (expNo >= 17 && expNo <= 20);

  // Detect whether this is a ThingSpeak experiment
  const isThingSpeak =
    !isPacketTracer &&
    ((Boolean(category) && category.toLowerCase().includes('thingspeak')) ||
      experimentTitle.toLowerCase().includes('thingspeak') ||
      (expNo >= 11 && expNo <= 16));

  // Evidence slots are controlled by the experiment requirements.
  // ThingSpeak experiments 11–16 always expose all three requested evidence slots.
  // Basic sensor experiments expose hardware + serial only where requested; Flame Sensor (08)
  // intentionally has no Serial Monitor photo slot.
  const needsSerialMonitorPic = [4, 6, 7, 9].includes(expNo);
  const showHardwarePhoto = experimentSettings?.showHardwarePhoto !== false;
  const showSerialMonitor = experimentSettings?.showSerialMonitor !== false;
  const showThingSpeakDashboard = experimentSettings?.showThingSpeakDashboard !== false;
  const attachmentCategories: AttachmentCategoryConfig[] = isPacketTracer
    ? [
        {
          id: 'software_pic',
          label: 'Software Pic',
          description: 'Cisco Packet Tracer simulation captures and topology screenshots (Max 3)',
          icon: Monitor,
        },
      ]
    : isThingSpeak
    ? [
        ...(showHardwarePhoto
          ? [{ id: 'hardware' as const, label: 'Hardware Pic', description: 'Physical breadboard circuit & sensor wiring setup', icon: Camera }]
          : []),
        ...(showThingSpeakDashboard
          ? [{ id: 'dashboard' as const, label: 'ThingSpeak Dashboard', description: 'Cloud channel telemetry widgets & live charts', icon: LayoutDashboard }]
          : []),
        ...(showSerialMonitor
          ? [{ id: 'serial_monitor' as const, label: 'ThingSpeak Serial Monitor', description: 'Serial monitor output log & Wi-Fi transmission telemetry', icon: Terminal }]
          : []),
      ]
    : [
        ...(showHardwarePhoto
          ? [{ id: 'hardware' as const, label: 'Hardware Pic', description: 'Physical breadboard circuit & hardware wiring setup', icon: Camera }]
          : []),
        ...(needsSerialMonitorPic && showSerialMonitor
          ? [{ id: 'serial_monitor' as const, label: 'Serial Monitor Pic', description: 'Arduino Serial Monitor output screenshot', icon: Terminal }]
          : []),
      ];

  // Helper to categorize photos
  const getCategoryFiles = (catId: 'hardware' | 'dashboard' | 'serial_monitor' | 'software_pic'): PhotoItem[] => {
    if (catId === 'software_pic') {
      // Support a maximum of 3 software pictures for each Cisco Packet Tracer experiment
      return photos.slice(0, 3);
    }

    return photos.filter((photo) => {
      const cat = (photo.category || '').toLowerCase();
      const title = (photo.title || '').toLowerCase();
      const desc = (photo.description || '').toLowerCase();

      if (catId === 'dashboard') {
        return (
          cat.includes('dashboard') ||
          title.includes('dashboard') ||
          desc.includes('dashboard') ||
          title.includes('channel')
        );
      }
      if (catId === 'serial_monitor') {
        return (
          cat.includes('serial') ||
          title.includes('serial') ||
          desc.includes('serial') ||
          cat.includes('terminal') ||
          title.includes('terminal') ||
          title.includes('monitor')
        );
      }
      if (catId === 'hardware') {
        const isDashboard =
          cat.includes('dashboard') ||
          title.includes('dashboard') ||
          desc.includes('dashboard') ||
          title.includes('channel');
        const isSerial =
          cat.includes('serial') ||
          title.includes('serial') ||
          desc.includes('serial') ||
          cat.includes('terminal') ||
          title.includes('terminal') ||
          title.includes('monitor');
        return !isDashboard && !isSerial;
      }
      return false;
    });
  };

  const handleDownloadSinglePhoto = async (photo: PhotoItem, label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = photo.downloadUrl || photo.image;
    const safeTitle = label.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = `Exp_${String(expNo).padStart(2, '0')}_${safeTitle}.jpg`;
    await downloadPhotoFile(url, filename);
  };

  const handleViewPhoto = (photo: PhotoItem, label: string) => {
    setPreviewImageUrl(photo.image);
    setPreviewImageTitle(`${label} (Exp #${expNo} — ${experimentTitle})`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Blurred Dimmed Frosted Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl"
      />

      {/* Frosted Glass Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-2xl macos-glass-card rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header Bar */}
        <div className="px-6 py-5 macos-glass-nav border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#0a84ff]/15 text-[#38bdf8] flex items-center justify-center border border-[#0a84ff]/30 shrink-0">
              {isPacketTracer ? <Monitor className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#f5f5f7]">
                  {isPacketTracer ? 'Simulation Pictures' : 'Experiment Photos'}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-white/[0.08] text-[#a1a1a6] border border-white/10">
                  Exp #{String(expNo).padStart(2, '0')}
                </span>
              </div>
              <p className="text-xs text-[#a1a1a6] mt-0.5 truncate">
                {isPacketTracer
                  ? 'Cisco Packet Tracer simulation captures & topology images'
                  : 'Download the photos captured during this experiment.'}
              </p>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#a1a1a6] hover:text-[#f5f5f7] flex items-center justify-center transition-colors cursor-pointer border border-white/10 shrink-0 ml-2"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Content Area: Vertical Attachment List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {attachmentCategories.map((categoryItem, index) => {
            const files = getCategoryFiles(categoryItem.id);
            const hasFiles = files.length > 0;
            const isExpanded = expandedCategoryId === categoryItem.id;
            const Icon = categoryItem.icon;

            return (
              <motion.div
                key={categoryItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, type: 'spring', stiffness: 380, damping: 26 }}
                className="bg-white/[0.04] border border-white/10 hover:border-white/15 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Number, Icon, Label, Description */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-[#38bdf8] shrink-0">
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-[#a1a1a6] font-semibold">
                          {index + 1}.
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-[#f5f5f7] tracking-tight">
                          {categoryItem.label}
                        </h3>
                        {hasFiles && (
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#0a84ff]/20 text-[#38bdf8] border border-[#0a84ff]/30">
                            {files.length} {files.length === 1 ? 'file' : 'files'}
                          </span>
                        )}
                        {isPacketTracer && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/[0.06] text-[#a1a1aa] border border-white/10">
                            Max 3
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#a1a1a6] mt-0.5 truncate">
                        {categoryItem.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: View / Download Button & State */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    {hasFiles ? (
                      files.length === 1 ? (
                        <div className="flex items-center gap-2">
                          <motion.button
                            type="button"
                            onClick={() => handleViewPhoto(files[0], categoryItem.label)}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white macos-btn-gradient rounded-full shadow-md hover:brightness-105 transition-all cursor-pointer"
                            title={`View / Download ${categoryItem.label}`}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>View / Download</span>
                          </motion.button>
                        </div>
                      ) : (
                        /* Multiple files support under this category */
                        <motion.button
                          type="button"
                          onClick={() =>
                            setExpandedCategoryId(isExpanded ? null : categoryItem.id)
                          }
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white macos-btn-gradient rounded-full shadow-md hover:brightness-105 transition-all cursor-pointer"
                          title={`View / Download files for ${categoryItem.label}`}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>View / Download ({files.length})</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                          )}
                        </motion.button>
                      )
                    ) : (
                      /* Not added yet state: disabled button + subtle indicator */
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-[#71717a] bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.08]">
                          {isPacketTracer ? 'No software pictures added yet' : 'Not added yet'}
                        </span>
                        <button
                          type="button"
                          disabled
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#71717a] bg-white/[0.03] border border-white/10 rounded-full cursor-not-allowed opacity-50 select-none"
                          title={isPacketTracer ? 'No software pictures added yet' : 'Photo not added yet'}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>View / Download</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* For Cisco Packet Tracer: Show uploaded pictures as responsive thumbnail cards */}
                {isPacketTracer && hasFiles && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/[0.08]">
                    {files.map((file, fileIdx) => (
                      <div
                        key={fileIdx}
                        className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/40 hover:border-[#0a84ff]/40 transition-all flex flex-col"
                      >
                        <div
                          onClick={() => handleViewPhoto(file, `${categoryItem.label} #${fileIdx + 1}`)}
                          className="h-28 w-full cursor-pointer overflow-hidden bg-black/60 relative"
                        >
                          <img
                            src={file.image}
                            alt={file.title || `Software Pic ${fileIdx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-black/60 text-white border border-white/20">
                              <Eye className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                        <div className="p-2.5 flex items-center justify-between gap-2 bg-white/[0.03]">
                          <span className="text-xs font-medium text-[#f5f5f7] truncate">
                            {file.title || `Picture ${fileIdx + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={(e) =>
                              handleDownloadSinglePhoto(
                                file,
                                file.title || `Software_Pic_${fileIdx + 1}`,
                                e
                              )
                            }
                            className="p-1 text-[#38bdf8] hover:text-white rounded-lg hover:bg-[#0a84ff]/20 transition-colors"
                            title="Download picture"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Clean "No software pictures added yet" message for Packet Tracer before files are added */}
                {isPacketTracer && !hasFiles && (
                  <div className="py-3 px-4 rounded-xl bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-between text-xs text-[#a1a1a6]">
                    <span>No software pictures added yet</span>
                    <span className="text-[11px] text-[#71717a]">Maximum 3 simulation captures supported</span>
                  </div>
                )}

                {/* Expanded list when multiple non-packet-tracer files are available */}
                <AnimatePresence>
                  {!isPacketTracer && hasFiles && files.length > 1 && isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-2 border-t border-white/[0.08] space-y-2 overflow-hidden"
                    >
                      {files.map((file, fileIdx) => (
                        <div
                          key={fileIdx}
                          className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-[11px] font-mono text-[#a1a1a6]">
                              #{fileIdx + 1}
                            </span>
                            <span className="text-xs font-medium text-[#f5f5f7] truncate">
                              {file.title || `Attachment ${fileIdx + 1}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                handleViewPhoto(
                                  file,
                                  `${categoryItem.label} - File ${fileIdx + 1}`
                                )
                              }
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[#38bdf8] bg-[#0a84ff]/15 hover:bg-[#0a84ff]/25 rounded-full border border-[#0a84ff]/30 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Preview</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) =>
                                handleDownloadSinglePhoto(
                                  file,
                                  `${categoryItem.label}_${fileIdx + 1}`,
                                  e
                                )
                              }
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white macos-btn-gradient rounded-full transition-colors cursor-pointer shadow-xs"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-4 macos-glass-nav border-t border-white/10 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2 text-[#a1a1a6]">
            <span className="hidden sm:inline">
              Click preview to view in full resolution or download directly
            </span>
          </div>

          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-4 py-1.5 text-xs font-semibold text-[#f5f5f7] bg-white/[0.08] hover:bg-white/[0.14] rounded-full transition-colors cursor-pointer border border-white/15"
          >
            Close
          </motion.button>
        </div>
      </motion.div>

      {/* Fullscreen Image Preview Lightbox */}
      <ImageLightboxModal
        isOpen={Boolean(previewImageUrl)}
        imageUrl={previewImageUrl}
        imageTitle={previewImageTitle}
        onClose={() => setPreviewImageUrl(null)}
      />
    </div>
  );
};
