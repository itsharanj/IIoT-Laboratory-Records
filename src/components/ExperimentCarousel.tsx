import { useMemo, useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, FileCheck2, FileDown } from 'lucide-react';
import { Experiment } from '../types/experiment';
import { PencilSketchDiagram } from './PencilSketchDiagram';
import { generateExperimentPDF } from '../utils/pdfExport';

interface ExperimentCarouselProps {
  experiments: Experiment[];
  onSelectExperiment: (experiment: Experiment) => void;
  completedIds: Set<string>;
}

const wrap = (value: number, length: number) => ((value % length) + length) % length;

const getCategoryAccent = (categoryShort: string, category: string) => {
  if (categoryShort === 'Basic I/O & Sensors' || category.includes('Basic GPIO')) return '#60a5fa';
  if (categoryShort === 'ThingSpeak' || category.includes('ThingSpeak')) return '#38bdf8';
  if (categoryShort === 'Blynk' || category.includes('Blynk')) return '#34d399';
  if (categoryShort === 'Packet Tracer' || category.includes('Packet Tracer')) return '#fbbf24';
  if (categoryShort === 'Web Server' || category.includes('Web Server')) return '#a78bfa';
  if (categoryShort === 'Arduino Cloud & Voice' || category.includes('Voice')) return '#f472b6';
  return '#60a5fa';
};

const getCategoryIcon = (categoryShort: string, category: string) => {
  const accent = getCategoryAccent(categoryShort, category);
  return <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accent, boxShadow: `0 0 12px ${accent}` }} />;
};

export const ExperimentCarousel = ({
  experiments,
  onSelectExperiment,
  completedIds,
}: ExperimentCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeIndex = experiments.length ? wrap(activeIndex, experiments.length) : 0;

  const visibleCards = useMemo(() => {
    if (!experiments.length) return [];
    const radius = Math.min(2, Math.floor((experiments.length - 1) / 2));
    return Array.from({ length: Math.min(experiments.length, radius * 2 + 1) }, (_, i) => {
      const offset = i - radius;
      const index = wrap(safeIndex + offset, experiments.length);
      return { experiment: experiments[index], offset, index };
    });
  }, [experiments, safeIndex]);

  const move = (delta: number) => {
    if (experiments.length < 2) return;
    setActiveIndex((current) => wrap(current + delta, experiments.length));
  };

  if (!experiments.length) return null;

  return (
    <section className="experiment-carousel" aria-label="Experiments carousel">
      <div className="experiment-carousel-stage">
        {visibleCards.map(({ experiment, offset, index }) => {
          const isActive = offset === 0;
          const category = experiment.categoryShort || experiment.category;
          const accent = getCategoryAccent(category, experiment.category);
          const hasCode = Boolean(experiment.code?.trim());
          const hasResult = Boolean(experiment.conclusion?.trim());
          const isCompleted = completedIds.has(experiment.id);

          return (
            <motion.article
              key={experiment.id}
              className={`experiment-video-card ${isActive ? 'is-active' : 'is-side'}`}
              style={{ '--card-accent': accent, zIndex: 20 - Math.abs(offset) } as CSSProperties}
              animate={{
                x: offset * 360,
                scale: isActive ? 1 : Math.max(0.84, 1 - Math.abs(offset) * 0.08),
                opacity: isActive ? 1 : Math.max(0.42, 0.72 - Math.abs(offset) * 0.12),
                rotateY: 0,
                rotateZ: 0,
                filter: isActive ? 'grayscale(0) saturate(1)' : 'grayscale(1) saturate(0.18)',
              }}
              transition={{ type: 'spring', stiffness: 240, damping: 28, mass: 0.85 }}
              drag={isActive ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.14}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 55 || Math.abs(info.velocity.x) > 450) {
                  move(info.offset.x < 0 ? 1 : -1);
                }
              }}
              onClick={() => {
                // Only the centered card opens the experiment details.
                // Clicking a side card brings that experiment to the center first.
                if (isActive) {
                  onSelectExperiment(experiment);
                } else {
                  move(offset);
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  if (isActive) {
                    onSelectExperiment(experiment);
                  } else {
                    move(offset);
                  }
                }
              }}
              aria-label={`${experiment.title}${isActive ? ', active experiment' : ''}`}
            >
              <div className="experiment-video-media">
                <PencilSketchDiagram
                  apparatus={experiment.apparatus}
                  category={experiment.category}
                  title={experiment.title}
                  expNo={experiment.expNo}
                  className="w-full h-full"
                />
                <div className="experiment-video-shade" />
                <div className="experiment-video-topline">
                  <span className="experiment-video-category">
                    {getCategoryIcon(category, experiment.category)}
                    {category}
                  </span>
                  <span className="experiment-video-number">{String(experiment.expNo).padStart(2, '0')}</span>
                </div>
                <div className="experiment-video-copy">
                  <div className="flex items-center gap-2 mb-1.5">
                    {isCompleted && <span className="experiment-video-completed">Completed</span>}
                    <span className="experiment-video-index">EXP {String(experiment.expNo).padStart(2, '0')}</span>
                  </div>
                  <h3>{experiment.title}</h3>
                  <p>{experiment.aim}</p>
                </div>
              </div>

              <div className="experiment-video-footer">
                <div className="experiment-video-status">
                  <span className={hasCode ? 'ready' : 'pending'}><Code2 /> {hasCode ? 'Code Ready' : 'Code not added yet'}</span>
                  <span className={hasResult ? 'ready' : 'pending'}><FileCheck2 /> {hasResult ? 'Result Ready' : 'Result not added yet'}</span>
                </div>

                <div className="experiment-video-actions">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      generateExperimentPDF(experiment);
                    }}
                    aria-label={`Download ${experiment.title} record PDF`}
                    title="Download Complete Record (PDF)"
                  >
                    <FileDown />
                  </button>
                  <button
                    type="button"
                    className="open"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (isActive) {
                        onSelectExperiment(experiment);
                      } else {
                        move(offset);
                      }
                    }}
                    aria-label={isActive ? `Open ${experiment.title}` : `Center ${experiment.title}`}
                  >
                    <span>{isActive ? 'Quick Look' : 'Center Card'}</span>
                    <ArrowUpRight />
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="experiment-carousel-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Previous experiment" className="experiment-carousel-arrow">
          <ArrowLeft />
        </button>
        <div className="experiment-carousel-progress" aria-label={`Experiment ${safeIndex + 1} of ${experiments.length}`}>
          <div className="experiment-carousel-count">
            <strong>{String(safeIndex + 1).padStart(2, '0')}</strong>
            <span>/ {String(experiments.length).padStart(2, '0')}</span>
          </div>
          <div className="experiment-carousel-track">
            {experiments.map((experiment, index) => (
              <button
                type="button"
                key={experiment.id}
                onClick={() => setActiveIndex(index)}
                className={`experiment-carousel-segment ${index === safeIndex ? 'active' : ''}`}
                style={{ '--segment-accent': getCategoryAccent(experiment.categoryShort || experiment.category, experiment.category) } as CSSProperties}
                aria-label={`Go to experiment ${experiment.expNo}`}
              />
            ))}
          </div>
        </div>
        <button type="button" onClick={() => move(1)} aria-label="Next experiment" className="experiment-carousel-arrow next">
          <ArrowRight />
        </button>
      </div>

      <p className="experiment-carousel-hint">DRAG · SCROLL · ARROWS</p>
    </section>
  );
};
