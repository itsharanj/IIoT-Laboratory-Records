import { useEffect, useState } from 'react';
import { BarChart3, Users, ClipboardCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Student = { id: string; full_name: string | null; created_at: string; experiment_progress: { experiment_id: string }[] };

export function AdminDashboard({ totalExperiments }: { totalExperiments: number }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { supabase?.from('profiles').select('id, full_name, created_at, experiment_progress(experiment_id)').eq('role', 'student').order('created_at', { ascending: false }).then(({ data }) => { setStudents((data ?? []) as Student[]); setLoading(false); }); }, []);
  const completed = students.reduce((sum, student) => sum + student.experiment_progress.length, 0);
  const average = students.length ? Math.round((completed / (students.length * totalExperiments)) * 100) : 0;
  const stats = [[Users, students.length, 'Students'], [ClipboardCheck, completed, 'Completed records'], [BarChart3, `${average}%`, 'Class progress']];
  return <section className="pb-10"><div className="mb-7"><p className="text-xs font-bold tracking-[0.18em] uppercase text-[#60a5fa]">Administrator</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Class overview</h1><p className="mt-2 text-sm text-[#a1a1a6]">Live progress across registered students.</p></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">{stats.map(([Icon, value, label]) => <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5"><Icon className="w-5 h-5 text-[#60a5fa]" /><p className="text-3xl font-bold mt-4">{value}</p><p className="text-sm text-[#a1a1a6] mt-1">{label}</p></div>)}</div><div className="rounded-2xl border border-white/10 bg-white/[0.045] overflow-hidden"><div className="p-5 border-b border-white/10"><h2 className="font-semibold">Student records</h2></div>{loading ? <p className="p-6 text-sm text-[#a1a1a6]">Loading student records…</p> : students.length === 0 ? <p className="p-6 text-sm text-[#a1a1a6]">No student accounts yet.</p> : <div className="divide-y divide-white/10">{students.map(student => { const count = student.experiment_progress.length; return <div key={student.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between"><div><p className="font-medium">{student.full_name || 'Student'}</p><p className="text-xs text-[#a1a1a6]">Joined {new Date(student.created_at).toLocaleDateString()}</p></div><div className="flex items-center gap-3"><div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-[#0a84ff]" style={{ width: `${(count / totalExperiments) * 100}%` }} /></div><span className="text-sm text-[#d1d1d6] tabular-nums">{count}/{totalExperiments}</span></div></div>; })}</div>}</div></section>;
}
