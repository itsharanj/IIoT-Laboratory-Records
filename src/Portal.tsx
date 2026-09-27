import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, LogOut, ShieldCheck } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import LabApp from './App';
import { AuthScreen } from './components/AuthScreen';
import { StudentLogin } from './components/StudentLogin';
import { AdminUpload } from './components/AdminUpload';
import { INITIAL_EXPERIMENTS } from './data/experiments';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { getStudentRosterEntry } from './lib/studentProgress';

export default function Portal() {
  const [view, setView] = useState<'home' | 'student' | 'admin'>('home');
  const [studentRegisterNumber, setStudentRegisterNumber] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string>('Student');
  const [studentSupporter, setStudentSupporter] = useState(false); const [session, setSession] = useState<Session | null>(null); const [checking, setChecking] = useState(false); const [error, setError] = useState('');
  useEffect(() => { if (!supabase) return; supabase.auth.signOut(); const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next)); return () => data.subscription.unsubscribe(); }, []);
  useEffect(() => { if (!session || view !== 'admin' || !supabase) return; setChecking(true); supabase.from('profiles').select('role').eq('id', session.user.id).single().then(({ data, error: queryError }) => { setChecking(false); if (queryError || data?.role !== 'admin') { setError('This email does not have administrator access.'); supabase.auth.signOut(); } }); }, [session, view]);
  if (!isSupabaseConfigured) return <div className="min-h-screen grid place-items-center bg-black text-white">Supabase settings are missing.</div>;
  if (view === 'student' && !studentRegisterNumber) return <StudentLogin onSuccess={(registerNumber) => { const entry = getStudentRosterEntry(registerNumber); setStudentRegisterNumber(registerNumber); setStudentName(entry?.name ?? 'Student'); setStudentSupporter(Boolean(entry?.supporter)); }} onBack={() => setView('home')} />;
  if (view === 'student' && studentRegisterNumber) return <LabApp studentRegisterNumber={studentRegisterNumber} studentName={studentName} studentSupporter={studentSupporter} onStudentLogout={() => { setStudentRegisterNumber(null); setStudentName('Student'); setStudentSupporter(false); setView('home'); }} />;
  if (view === 'admin' && !session) return <AuthScreen />;
  if (view === 'admin' && session) return <div className="admin-page-shell"><main className="mx-auto w-full">{checking ? <div className="admin-access-check">Checking administrator access…</div> : error ? <div className="admin-access-check error">{error}</div> : <AdminUpload experiments={INITIAL_EXPERIMENTS} />}</main><footer className="admin-footer">© GPTI · IIoT Laboratory Record · Administrator</footer></div>;
  return <div className="min-h-screen grid place-items-center overflow-hidden bg-black p-5 text-[#f5f5f7] relative"><div className="absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full bg-[#0a84ff]/15 blur-[120px]" /><main className="relative w-full max-w-2xl rounded-[30px] border border-white/10 bg-[#151518]/90 p-8 backdrop-blur-2xl sm:p-11"><div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#0a84ff] to-[#38bdf8]"><BookOpen className="w-5 h-5" /></div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#60a5fa]">IIoT Laboratory Record</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Choose your portal</h1><p className="mt-3 text-[#a1a1a6]">Students can explore and download laboratory material. Admin access is reserved for adding material.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><button onClick={() => setView('student')} className="rounded-2xl border border-white/10 bg-white/[.04] p-6 text-left transition hover:border-[#0a84ff]/60"><BookOpen className="w-6 h-6 text-[#60a5fa]" /><h2 className="mt-5 font-bold">Student Login</h2><p className="mt-2 text-sm text-[#a1a1a6]">View experiments, videos, photos and PDFs.</p><span className="mt-5 flex gap-2 text-sm text-[#93c5fd]">Open website <ArrowRight className="w-4 h-4" /></span></button><button onClick={() => setView('admin')} className="rounded-2xl border border-white/10 bg-white/[.04] p-6 text-left transition hover:border-[#0a84ff]/60"><ShieldCheck className="w-6 h-6 text-[#60a5fa]" /><h2 className="mt-5 font-bold">Admin Login</h2><p className="mt-2 text-sm text-[#a1a1a6]">Securely upload photos, videos and PDFs.</p><span className="mt-5 flex gap-2 text-sm text-[#93c5fd]">Admin access <ArrowRight className="w-4 h-4" /></span></button></div><p className="mt-7 text-center text-xs text-[#71717a]">© GPTI · Made by SharanJ</p></main></div>;
}
