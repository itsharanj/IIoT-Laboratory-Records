import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Video, Play, ExternalLink } from 'lucide-react';

interface TutorialVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  experimentTitle: string;
  expNo: number;
}

/**
 * Checks if a URL is a YouTube or Vimeo link and returns embed-ready URL
 */
function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[2]}?autoplay=1`;
  }
  return null;
}

export const TutorialVideoModal = ({
  isOpen,
  onClose,
  videoUrl,
  experimentTitle,
  expNo,
}: TutorialVideoModalProps) => {
  // Esc key listener to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null;
  const hasVideo = Boolean(videoUrl && videoUrl.trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Dimmed Frosted Backdrop - Clicking outside closes modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl cursor-pointer"
        aria-hidden="true"
      />

      {/* Video Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-4xl macos-glass-card rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="px-6 py-4.5 macos-glass-nav border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#8b5cf6]/20 text-[#a78bfa] flex items-center justify-center border border-[#8b5cf6]/35 shrink-0 shadow-xs">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-[#8b5cf6]/20 text-[#c4b5fd] border border-[#8b5cf6]/30 font-semibold">
                  Exp #{String(expNo).padStart(2, '0')}
                </span>
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#f5f5f7] truncate">
                  Networking Tutorial
                </h2>
              </div>
              <p className="text-xs text-[#a1a1a6] mt-0.5 truncate">
                {experimentTitle} — Cisco Packet Tracer Video Guide
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

        {/* Content Area: Video Player or Pending Notice */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-black/40 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[420px]">
          {hasVideo ? (
            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl relative">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`Tutorial Video for ${experimentTitle}`}
                  className="w-full aspect-video min-h-[320px] sm:min-h-[460px] border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[70vh] rounded-2xl bg-black"
                  src={videoUrl}
                >
                  <track kind="captions" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ) : (
            <div className="w-full max-w-md text-center py-12 px-6 macos-glass-card rounded-2xl border border-dashed border-white/20 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-[#8b5cf6]/15 text-[#a78bfa] flex items-center justify-center border border-[#8b5cf6]/30 shadow-inner">
                <Video className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#f5f5f7]">
                  Tutorial Video Coming Soon
                </h3>
                <p className="text-xs text-[#a1a1a6] leading-relaxed">
                  A high-definition step-by-step video walk-through for{' '}
                  <span className="text-[#38bdf8] font-medium">{experimentTitle}</span> is currently being prepared.
                  Once added to the centralized experiment data, it will play directly in this embedded player.
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-[#c4b5fd] bg-[#8b5cf6]/15 px-3 py-1 rounded-full border border-[#8b5cf6]/30">
                  <span>Target:</span> Exp {expNo} Cisco Simulation Guide
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3.5 macos-glass-nav border-t border-white/10 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2 text-[#a1a1a6]">
            <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse" />
            <span className="hidden sm:inline">Cisco Packet Tracer In-App Video Player</span>
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
    </div>
  );
};
