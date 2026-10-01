import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, ChevronLeft, ChevronRight, Edit3, Image as ImageIcon, X } from 'lucide-react';
import { Experiment } from '../types/experiment';
import { resolveExperimentPhotos, NormalizedPhoto } from '../utils/photoManager';
import { supabase } from '../lib/supabase';

interface RecordBookModalProps {
  experiment: Experiment;
  studentName: string;
  studentRegisterNumber: string;
  onClose: () => void;
}

type StudentDetails = {
  name: string;
  registerNumber: string;
  subject: string;
  semester: string;
  year: string;
};

const detailsKey = (register: string) => `iiot-record-details:${register.trim().toUpperCase()}`;

function loadDetails(studentName: string, register: string): StudentDetails {
  try {
    const raw = localStorage.getItem(detailsKey(register));
    if (raw) return { subject: 'IIOT', semester: '5th Semester', year: '', ...JSON.parse(raw) };
  } catch {}
  return {
    name: studentName || '',
    registerNumber: register || '',
    subject: 'IIOT',
    semester: '5th Semester',
    year: '',
  };
}

export function RecordBookModal({
  experiment,
  studentName,
  studentRegisterNumber,
  onClose,
}: RecordBookModalProps) {
  const [details, setDetails] = useState<StudentDetails>(() => loadDetails(studentName, studentRegisterNumber));
  const [editing, setEditing] = useState(false);
  const [spread, setSpread] = useState(0);
  const [photos, setPhotos] = useState<NormalizedPhoto[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const local = await resolveExperimentPhotos(experiment);
      let remote: NormalizedPhoto[] = [];
      if (supabase) {
        const { data } = await supabase
          .from('experiment_media')
          .select('title, file_path, media_type')
          .eq('experiment_id', experiment.id)
          .order('created_at', { ascending: true });
        remote = (data ?? []).map((item: any) => ({
          url: supabase.storage.from('experiment-media').getPublicUrl(item.file_path).data.publicUrl,
          title: item.title || experiment.title,
          caption: item.title || 'Uploaded experiment evidence',
          type: 'photo' as const,
        }));
      }
      const merged = [...remote, ...local.filter((photo) => !remote.some((r) => r.url === photo.url))];
      if (alive) setPhotos(merged);
    };
    void load();
    return () => { alive = false; };
  }, [experiment]);

  const pageCount = useMemo(() => {
    // One spread is the front practical sheet. Additional spreads contain
    // the remaining experiment material so long records can still be read
    // like a real book instead of one giant webpage.
    return 3;
  }, []);

  const saveDetails = () => {
    try {
      localStorage.setItem(detailsKey(studentRegisterNumber), JSON.stringify(details));
    } catch {}
    setEditing(false);
  };

  const next = () => setSpread((s) => Math.min(pageCount - 1, s + 1));
  const prev = () => setSpread((s) => Math.max(0, s - 1));

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });

  const currentPhoto = photos[photoIndex];

  return (
    <AnimatePresence>
      <motion.div
        className="record-overlay fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 record-backdrop" onClick={onClose} />

        <motion.div
          className="relative z-10 w-full max-w-[1500px] h-[96vh] sm:h-[92vh] flex flex-col"
          initial={{ opacity: 0, y: 40, scale: .94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 35, scale: .96 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        >
          <div className="record-toolbar no-print">
            <div className="flex items-center gap-3 min-w-0">
              <div className="record-toolbar-book"><BookOpen size={18} /></div>
              <div className="min-w-0">
                <div className="record-toolbar-kicker">IIoT RECORD BOOK</div>
                <div className="record-toolbar-title truncate">Experiment {String(experiment.expNo).padStart(2, '0')} · {experiment.title}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="record-tool-btn" onClick={() => setEditing(true)}><Edit3 size={15} /> Edit details</button>
              <button className="record-close-btn" onClick={onClose} aria-label="Close record"><X size={18} /></button>
            </div>
          </div>

          <div className="record-stage">
            <div className="record-shadow" />
            <div className="record-spread">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`spread-${spread}`}
                  className="record-pages"
                  initial={{ opacity: 0, rotateY: spread === 0 ? 0 : 8, x: spread > 0 ? 28 : -28 }}
                  animate={{ opacity: 1, rotateY: 0, x: 0 }}
                  exit={{ opacity: 0, rotateY: spread > 0 ? -8 : 8, x: spread > 0 ? -28 : 28 }}
                  transition={{ duration: .42, ease: [0.22, 1, .36, 1] }}
                >
                  <section className="record-page record-page-left">
                    <div className="record-paper-inner">
                      {spread === 0 ? (
                        <>
                          <div className="record-page-header">
                            <span>EXPERIMENT - {String(experiment.expNo).padStart(2, '0')}</span>
                            <span>Page No. 01</span>
                          </div>
                          <div className="record-hand-title">Practical Record</div>
                          <div className="record-photo-area">
                            {currentPhoto ? (
                              <img
                                src={currentPhoto.url}
                                alt={currentPhoto.title}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : (
                              <div className="record-image-placeholder">
                                <ImageIcon size={34} />
                                <span>Experiment image</span>
                                <small>Uses the image already configured for this experiment.</small>
                              </div>
                            )}
                          </div>
                          <div className="record-caption">{currentPhoto?.caption || 'Hardware / practical setup'}</div>
                          {photos.length > 1 && (
                            <div className="record-photo-dots">
                              {photos.map((_, i) => <button key={i} className={i === photoIndex ? 'active' : ''} onClick={() => setPhotoIndex(i)} />)}
                            </div>
                          )}
                          <div className="record-hand-note">Circuit / output observation</div>
                          <div className="record-ruled mini-lines" />
                        </>
                      ) : spread === 1 ? (
                        <>
                          <div className="record-page-header"><span>EXPT. NO. {String(experiment.expNo).padStart(2, '0')}</span><span>Page No. 02</span></div>
                          <div className="record-hand-title">{experiment.title}</div>
                          <div className="record-hand-section"><b>Aim:</b> {experiment.aim}</div>
                          <div className="record-hand-section"><b>Components required:</b></div>
                          <ol className="record-hand-list">{experiment.apparatus.map((a, i) => <li key={i}>{a.name}{a.specs ? ` — ${a.specs}` : ''}</li>)}</ol>
                          <div className="record-hand-section"><b>Procedure:</b></div>
                          <ol className="record-hand-list">{experiment.procedure.split('\n').map((line, i) => <li key={i}>{line.replace(/^\d+\.\s*/, '')}</li>)}</ol>
                        </>
                      ) : (
                        <>
                          <div className="record-page-header"><span>EXPT. NO. {String(experiment.expNo).padStart(2, '0')}</span><span>Page No. 04</span></div>
                          <div className="record-hand-section"><b>Adding Code:</b></div>
                          <pre className="record-code">{experiment.code || 'Code will be added for this experiment.'}</pre>
                          <div className="record-hand-section"><b>Result:</b> {experiment.conclusion || experiment.output?.caption || 'Experiment verified successfully.'}</div>
                        </>
                      )}
                    </div>
                  </section>

                  <div className="record-binding" />

                  <section className="record-page record-page-right">
                    <div className="record-paper-inner">
                      {spread === 0 ? (
                        <>
                          <div className="record-page-header">
                            <span>Date: __________</span>
                            <span>Page No. 01</span>
                          </div>
                          <div className="record-student-box">
                            <div><span>Name</span><b>{details.name || '________________'}</b></div>
                            <div><span>Register No.</span><b>{details.registerNumber || '________________'}</b></div>
                            <div><span>Subject</span><b>{details.subject || 'IIOT'}</b></div>
                            <div><span>Semester</span><b>{details.semester || '________'}</b></div>
                            <div><span>Year</span><b>{details.year || '________'}</b></div>
                          </div>
                          <div className="record-hand-title record-right-title">Experiment - {String(experiment.expNo).padStart(2, '0')}</div>
                          <div className="record-big-aim"><b>Aim:</b><br />{experiment.aim}</div>
                          <div className="record-hand-section"><b>Components required:</b></div>
                          <ol className="record-hand-list compact">{experiment.apparatus.slice(0, 6).map((a, i) => <li key={i}>{a.name}</li>)}</ol>
                          <div className="record-hand-section"><b>Procedure:</b></div>
                          <div className="record-ruled record-ruled-tall" />
                        </>
                      ) : spread === 1 ? (
                        <>
                          <div className="record-page-header"><span>Date: __________</span><span>Page No. 03</span></div>
                          <div className="record-hand-title">Procedure / Observation</div>
                          <div className="record-ruled record-ruled-tall" />
                          <div className="record-hand-section"><b>Result:</b></div>
                          <div className="record-result-box">{experiment.conclusion || experiment.output?.caption}</div>
                        </>
                      ) : (
                        <>
                          <div className="record-page-header"><span>Date: __________</span><span>Page No. 05</span></div>
                          <div className="record-hand-title">Output / Verification</div>
                          <div className="record-ruled record-ruled-tall" />
                          <div className="record-hand-section"><b>Remarks:</b></div>
                          <div className="record-ruled mini-lines" />
                        </>
                      )}
                    </div>
                  </section>
                </motion.div>
              </AnimatePresence>

              <button className="record-corner record-corner-left" onClick={prev} disabled={spread === 0} aria-label="Previous page"><ChevronLeft size={20} /></button>
              <button className="record-corner record-corner-right" onClick={next} disabled={spread === pageCount - 1} aria-label="Next page"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="record-footer no-print">
            <span>Drag/turn the page corners · Arrow keys also work</span>
            <span>{spread + 1} / {pageCount} spread</span>
          </div>
        </motion.div>

        {editing && (
          <div className="record-edit-overlay">
            <div className="record-edit-card">
              <div className="flex items-center justify-between mb-5">
                <div><div className="record-toolbar-kicker">STUDENT DETAILS</div><h3>Edit your record details</h3></div>
                <button className="record-close-btn" onClick={() => setEditing(false)}><X size={17} /></button>
              </div>
              <div className="record-edit-grid">
                {([
                  ['name', 'Name'],
                  ['registerNumber', 'Register Number'],
                  ['subject', 'Subject'],
                  ['semester', 'Semester'],
                  ['year', 'Academic Year'],
                ] as const).map(([key, label]) => (
                  <label key={key}>{label}<input value={details[key]} onChange={(e) => setDetails((d) => ({ ...d, [key]: e.target.value }))} /></label>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-5">
                <button className="record-tool-btn" onClick={() => setEditing(false)}>Cancel</button>
                <button className="record-save-btn" onClick={saveDetails}>Save for this student</button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
