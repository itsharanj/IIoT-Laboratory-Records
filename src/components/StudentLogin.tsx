import { FormEvent, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Check, IdCard, LoaderCircle, UserRound } from 'lucide-react';
import { motion } from 'motion/react';
import { findStudentByRegisterNumber, getStudentRosterEntry, isValidDiplomaRegisterNumber, loginOrCreateStudent, normalizeRegisterNumber } from '../lib/studentProgress';

interface StudentLoginProps {
  onSuccess: (registerNumber: string, studentName: string) => void;
  onBack: () => void;
}

export function StudentLogin({ onSuccess, onBack }: StudentLoginProps) {
  const [registerNumber, setRegisterNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [needsName, setNeedsName] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const buttonAreaRef = useRef<HTMLDivElement>(null);
  const validRegisterNumber = isValidDiplomaRegisterNumber(registerNumber);
  const validName = studentName.trim().length >= 2;
  const ready = validRegisterNumber && (!needsName || validName);

  const moveButton = () => {
    if (ready || loading || !buttonAreaRef.current) return;
    const maxX = Math.max(0, Math.min(74, (buttonAreaRef.current.clientWidth - 112) / 2));
    setButtonOffset({
      x: Math.round((Math.random() * 2 - 1) * maxX),
      y: Math.round((Math.random() * 2 - 1) * 9),
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validRegisterNumber || (needsName && !validName)) {
      setMessage(needsName ? 'Enter your name to finish setting up your student login.' : 'Use a valid diploma register number: 3 digits + 2 letters + 5 digits. Special characters are not allowed.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const normalizedRegisterNumber = normalizeRegisterNumber(registerNumber);
      const existing = await findStudentByRegisterNumber(normalizedRegisterNumber);
      const savedName = existing?.student_name?.trim() || getStudentRosterEntry(normalizedRegisterNumber)?.name;
      if (savedName) {
        const student = await loginOrCreateStudent(normalizedRegisterNumber, savedName);
        onSuccess(student.register_number, student.student_name || savedName);
      } else if (!needsName) {
        setNeedsName(true);
        setMessage('New register number. Add your name to create your student login.');
      } else {
        const student = await loginOrCreateStudent(normalizedRegisterNumber, studentName);
        onSuccess(student.register_number, student.student_name || studentName.trim());
      }
    } catch (error) {
      const details = error as { message?: string; details?: string; hint?: string; code?: string } | null;
      const detailText = [details?.message, details?.details, details?.hint].filter(Boolean).join(' — ');
      setMessage(detailText || 'Unable to sign in right now. Please check the Supabase setup and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="runaway-auth-page">
      <div className="runaway-browser">
        <div className="traffic"><i className="r" /><i className="y" /><i className="g" /></div>
        <div className="runaway-browser-center">IIOT LABORATORY · <span className="blue">STUDENT</span></div>
        <div className="runaway-browser-right">localhost / student</div>
      </div>

      <motion.main
        initial={{ opacity: 0, y: 18, scale: .98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="runaway-main"
      >
        <div className="runaway-meta">IIOT LABORATORY · STUDENT LOGIN</div>
        <h1 className="runaway-title">STUDENT <span className="teal">LOGIN</span></h1>

        <section className="runaway-card">
          <div className="tether"><span className="tether-mark" />IIOT LAB</div>
          <h2 className="signin-heading">Student access</h2>
          <p className="signin-copy">Enter your college register number to open your laboratory record.</p>

          <form className="runaway-form" onSubmit={submit} noValidate>
            <div className="field">
              <div className="field-row"><label htmlFor="student-register-number">Register number</label></div>
              <div className={`input-wrap ${validRegisterNumber ? 'valid' : ''}`}>
                <IdCard size={16} />
                <input id="student-register-number" type="text" autoComplete="off" spellCheck={false} value={registerNumber} onChange={(e) => { setRegisterNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()); setNeedsName(false); setStudentName(''); setMessage(''); }} required />
                {validRegisterNumber && <span className="valid-check"><Check size={11} /></span>}
              </div>
            </div>
            {needsName && <motion.div className="field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: .28, ease: 'easeOut' }}>
              <div className="field-row"><label htmlFor="student-name">Your name</label></div>
              <div className={`input-wrap ${validName ? 'valid' : ''}`}>
                <UserRound size={16} />
                <input id="student-name" type="text" autoComplete="name" value={studentName} onChange={(e) => { setStudentName(e.target.value); setMessage(''); }} required />
                {validName && <span className="valid-check"><Check size={11} /></span>}
              </div>
            </motion.div>}
            <div ref={buttonAreaRef} className="runaway-zone" onMouseMove={moveButton}>
              <div className="target-ring" />
              <button type="submit" disabled={loading} className={`runaway-button ${ready ? 'ready' : ''}`} style={{ transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)` }}>
                {loading ? <LoaderCircle size={14} className="animate-spin" /> : <>{needsName ? 'Create login' : 'Continue'} <ArrowRight size={14} /></>}
              </button>
            </div>
            <div className="helper"><span className="helper-dot">●</span>{ready ? <>{needsName ? 'Add your name to finish setting up.' : 'Enter your register number to continue.'} <span className="key">Enter</span></> : 'Use a valid diploma register number: 3 digits + 2 letters + 5 digits. Special characters are not allowed.'}</div>
            {message && <div className="error" role="alert">{message}</div>}
          </form>

          <div className="card-divider" />
          <p className="create">Your laboratory progress is saved with your register number.</p>
          <button type="button" onClick={onBack} className="student-back-button"><BookOpen size={14} /> Back to portal</button>
        </section>
        <div className="runaway-bottom">IIOT LABORATORY · STUDENT ACCESS</div>
      </motion.main>
      <style>{`.student-back-button{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:16px;padding:11px;border:1px solid rgba(164,190,186,.16);border-radius:12px;background:#101c1c;color:#aab8b5;font:600 12px 'DM Sans',sans-serif;cursor:pointer;transition:background .2s ease,color .2s ease}.student-back-button:hover{background:#172625;color:#eef7f4}`}</style>
    </div>
  );
}
