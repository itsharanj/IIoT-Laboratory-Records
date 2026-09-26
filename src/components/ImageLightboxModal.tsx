import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';
import { downloadImageFile } from '../utils/pdfExport';

interface ImageLightboxModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  imageTitle?: string;
  onClose: () => void;
}

export const ImageLightboxModal = ({
  isOpen,
  imageUrl,
  imageTitle = 'Experiment Preview',
  onClose,
}: ImageLightboxModalProps) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Reset zoom level on image change or open
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(1);
    }
  }, [isOpen, imageUrl]);

  // Support ESC key to close
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

  if (!isOpen || !imageUrl) return null;

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 0.35, 3.0));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.max(prev - 0.35, 0.6));
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(1);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const safeName = (imageTitle || 'experiment_image')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_');
    downloadImageFile(imageUrl, `${safeName}.png`);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-6 cursor-zoom-out select-none"
      >
        {/* Top iOS-Style Floating Toolbar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl flex items-center justify-between z-10 cursor-default pt-2"
        >
          {/* Title & Metadata */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md border border-white/15">
              Fullscreen Preview
            </div>
            <span className="text-xs sm:text-sm font-medium text-[#f5f5f7] truncate max-w-[200px] sm:max-w-md">
              {imageTitle}
            </span>
          </div>

          {/* Controls: Zoom In, Zoom Out, Reset, Download, Close */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/15 shadow-lg">
              <motion.button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.6}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 disabled:opacity-40 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </motion.button>

              <span className="text-[11px] font-mono px-2 text-[#a1a1a6] font-semibold tabular-nums">
                {Math.round(zoomLevel * 100)}%
              </span>

              <motion.button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3.0}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 disabled:opacity-40 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </motion.button>

              {zoomLevel !== 1 && (
                <motion.button
                  type="button"
                  onClick={handleResetZoom}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="p-1.5 rounded-full text-[#38bdf8] hover:bg-white/15 transition-colors cursor-pointer ml-1"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </div>

            {/* Download Button */}
            <motion.button
              type="button"
              onClick={handleDownload}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#38bdf8] backdrop-blur-md border border-white/15 shadow-lg transition-colors cursor-pointer"
              title="Download High-Res Image"
            >
              <Download className="w-4 h-4" />
            </motion.button>

            {/* Close Button */}
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.08, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/15 shadow-lg transition-colors cursor-pointer"
              title="Close Preview (Esc)"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Center Image Container */}
        <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-6 overflow-hidden">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative cursor-default max-w-full max-h-full flex items-center justify-center"
          >
            <motion.img
              src={imageUrl}
              alt={imageTitle}
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="max-w-[92vw] max-h-[82vh] object-contain rounded-2xl shadow-2xl bg-black/60 p-2 sm:p-4 border border-white/15 select-none"
            />
          </motion.div>
        </div>

        {/* Bottom Hint */}
        <div className="text-center pb-2 cursor-default" onClick={(e) => e.stopPropagation()}>
          <span className="text-[11px] text-[#a1a1a6] bg-black/40 px-3 py-1 rounded-full border border-white/10">
            Click outside or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">Esc</kbd> to dismiss
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
