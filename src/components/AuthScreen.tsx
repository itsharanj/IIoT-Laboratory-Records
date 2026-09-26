import { FormEvent, useState } from 'react';
import { ArrowRight, BookOpen, LoaderCircle, ShieldCheck, UserRound } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function AuthScreen() {
  const [mode] = useState<'signin'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setMessage('');
    const result = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (result.error) setMessage(result.error.message);
  };

  return <div className="min-h-screen bg-[#000] text-[#f5f5f7] flex items-center justify-center px-4 relative overflow-hidden">
    <div className="absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full bg-[#0a84ff]/15 blur-[120px]" />
    <div className="absolute -bottom-40 -right-40 h-[34rem] w-[34rem] rounded-full bg-violet-600/15 blur-[120px]" />
    <main className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-[#151518]/85 backdrop-blur-2xl shadow-2xl p-7 sm:p-9">
      <div className="w-12 h-12 mb-6 rounded-2xl bg-gradient-to-br from-[#0a84ff] to-[#38bdf8] grid place-items-center shadow-lg shadow-[#0a84ff]/30"><BookOpen className="w-5 h-5" /></div>
      <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#60a5fa]">IIoT Laboratory</p>
      <h1 className="text-2xl font-bold tracking-tight mt-2">Admin sign in</h1>
      <p className="text-sm text-[#a1a1a6] mt-2">Only the authorised administrator can upload or manage laboratory material.</p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block text-sm text-[#d1d1d6]">Email<input value={email} onChange={e => setEmail(e.target.value)} required type="email" className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 outline-none focus:border-[#0a84ff]" placeholder="name@example.com" /></label>
        <label className="block text-sm text-[#d1d1d6]">Password<input value={password} onChange={e => setPassword(e.target.value)} required minLength={6} type="password" className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 outline-none focus:border-[#0a84ff]" placeholder="Minimum 6 characters" /></label>
        {message && <p className="text-sm rounded-xl border border-[#0a84ff]/25 bg-[#0a84ff]/10 px-3 py-2.5 text-[#93c5fd]">{message}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-[#0a84ff] hover:bg-[#0077ed] disabled:opacity-70 py-3 font-semibold flex items-center justify-center gap-2 transition-colors">{loading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}Sign in</button>
      </form>
      <div className="mt-7 pt-5 border-t border-white/10 flex gap-4 text-xs text-[#a1a1a6]"><span className="flex gap-1.5 items-center"><UserRound className="w-3.5 h-3.5" /> Student records</span><span className="flex gap-1.5 items-center"><ShieldCheck className="w-3.5 h-3.5" /> Admin oversight</span></div>
      <p className="mt-5 text-center text-[11px] font-medium tracking-wide text-[#71717a]">© GPTI · Made by SharanJ</p>
    </main>
  </div>;
}
