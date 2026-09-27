import { FormEvent, useState } from 'react';
import { ArrowRight, BookOpen, LoaderCircle, UserRound, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { loginOrCreateStudent } from '../lib/studentProgress';

interface StudentLoginProps {
  onSuccess: (registerNumber: string) => void;
  onBack: () => void;
}

export function StudentLogin({ onSuccess, onBack }: StudentLoginProps) {
  const [registerNumber, setRegisterNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const student = await loginOrCreateStudent(registerNumber);
      onSuccess(student.register_number);
    } catch (error) {
      const details = error as { message?: string; details?: string; hint?: string; code?: string } | null;
      const detailText = [details?.message, details?.details, details?.hint].filter(Boolean).join(' — ');
      setMessage(detailText || 'Unable to sign in right now. Please check the Supabase setup and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000] text-[#f5f5f7] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full bg-[#0a84ff]/15 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 h-[34rem] w-[34rem] rounded-full bg-violet-600/15 blur-[120px]" />
      <motion.main
        initial={{ opacity: 0, y: 18, scale: .98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="relative w-full max-w-md rounded-[30px] border border-white/10 bg-[#151518]/85 backdrop-blur-2xl shadow-2xl p-7 sm:p-9"
      >
        <div className="w-12 h-12 mb-6 rounded-2xl bg-gradient-to-br from-[#0a84ff] to-[#38bdf8] grid place-items-center shadow-lg shadow-[#0a84ff]/30">
          <BookOpen className="w-5 h-5" />
        </div>
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#60a5fa]">IIoT Laboratory</p>
        <h1 className="text-2xl font-bold tracking-tight mt-2">Student Login</h1>
        <p className="text-sm text-[#a1a1a6] mt-2">Enter your college register number. Your laboratory progress will stay saved for this register number.</p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block text-sm text-[#d1d1d6]">
            Register Number
            <input
              value={registerNumber}
              onChange={(e) => setRegisterNumber(e.target.value.toUpperCase())}
              required
              autoFocus
              autoComplete="off"
              spellCheck={false}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-3.5 outline-none focus:border-[#0a84ff] focus:ring-4 focus:ring-[#0a84ff]/10 transition"
              placeholder="e.g. 23CSE001"
            />
          </label>
          {message && <p className="text-sm rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2.5 text-rose-200">{message}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-[#0a84ff] hover:bg-[#0077ed] disabled:opacity-70 py-3 font-semibold flex items-center justify-center gap-2 transition-colors">
            {loading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            {loading ? 'Checking…' : 'Login'}
          </button>
        </form>

        <div className="mt-7 pt-5 border-t border-white/10 flex flex-col gap-3 text-xs text-[#a1a1a6]">
          <span className="flex gap-1.5 items-center"><UserRound className="w-3.5 h-3.5 text-[#60a5fa]" /> Existing register number → progress is loaded automatically.</span>
          <span className="flex gap-1.5 items-center"><ShieldCheck className="w-3.5 h-3.5 text-[#60a5fa]" /> New register number → student record is created automatically.</span>
        </div>
        <button type="button" onClick={onBack} className="mt-6 w-full rounded-xl border border-white/10 bg-white/[.04] py-2.5 text-sm font-semibold text-[#a1a1a6] hover:text-white hover:bg-white/[.08] transition">Back to portal</button>
        <p className="mt-5 text-center text-[11px] font-medium tracking-wide text-[#71717a]">© GPTI · Made by SharanJ</p>
      </motion.main>
    </div>
  );
}
