import { supabase } from './supabase';

export type ExperimentStatus = 'not_started' | 'in_progress' | 'completed';
export type ExperimentStatusMap = Record<string, ExperimentStatus>;

export interface StudentProgressRecord {
  register_number: string;
  completed_experiment_ids: string[];
  experiment_status?: ExperimentStatusMap;
  updated_at?: string;
}

export function normalizeRegisterNumber(value: string) {
  return value.trim().replace(/\s+/g, ' ').toUpperCase();
}


export interface StudentRosterEntry {
  register_number: string;
  name: string;
  supporter?: boolean;
}

const STUDENT_ROSTER: Record<string, StudentRosterEntry> = {
  '175EC23033': { register_number: '175EC23033', name: 'PAVAN KUMAR' },
  '175EC23001': { register_number: '175EC23001', name: 'ADARSH KUMAR D R' },
  '175EC24002': { register_number: '175EC24002', name: 'ADIT R ACHAR' },
  '175EC24003': { register_number: '175EC24003', name: 'AKSHAY K' },
  '175EC24008': { register_number: '175EC24008', name: 'AMULYA' },
  '175EC24015': { register_number: '175EC24015', name: 'BHADRESH S' },
  '175EC24016': { register_number: '175EC24016', name: 'CHANDAN N' },
  '175EC24017': { register_number: '175EC24017', name: 'CHANDANA NAIKAR R', supporter: true },
  '175EC24020': { register_number: '175EC24020', name: 'DARSHAN H C' },
  '175EC24021': { register_number: '175EC24021', name: 'ESHWAR V' },
  '175EC24022': { register_number: '175EC24022', name: 'G J HARIPRASAD' },
  '175EC24024': { register_number: '175EC24024', name: 'GOKUL C' },
  '175EC24025': { register_number: '175EC24025', name: 'GURURAGHAVENDRA M' },
  '175EC24026': { register_number: '175EC24026', name: 'HARIPRASAD B' },
  '175EC24028': { register_number: '175EC24028', name: 'JEEVAN D' },
  '175EC24029': { register_number: '175EC24029', name: 'KARTHIK S' },
  '175EC24030': { register_number: '175EC24030', name: 'LAKSHMI A' },
  '175EC24032': { register_number: '175EC24032', name: 'M THRISHANTH' },
  '175EC24034': { register_number: '175EC24034', name: 'MADHUSUDHAN M' },
  '175EC24035': { register_number: '175EC24035', name: 'MANISH' },
  '175EC24037': { register_number: '175EC24037', name: 'MOHAMMED ASIF' },
  '175EC24040': { register_number: '175EC24040', name: 'NARESH R' },
  '175EC24041': { register_number: '175EC24041', name: 'PREETHAM K D' },
  '175EC24042': { register_number: '175EC24042', name: 'RAJESH A' },
  '175EC24044': { register_number: '175EC24044', name: 'S MANASA' },
  '175EC24046': { register_number: '175EC24046', name: 'SHARAN J' },
  '175EC24047': { register_number: '175EC24047', name: 'SHASHANK MACHANI' },
  '175EC24053': { register_number: '175EC24053', name: 'VISHWAS V' },
  '175EC24054': { register_number: '175EC24054', name: 'YATHISH V' },
  '175EC24055': { register_number: '175EC24055', name: 'YESHWANTH S' },
  '175EC24301': { register_number: '175EC24301', name: 'PAVAN SINGH R' },
  '175EC25301': { register_number: '175EC25301', name: 'DEEPAK R' },
  '175EC25302': { register_number: '175EC25302', name: 'PAVAN KUMAR' },
  '175EC25304': { register_number: '175EC25304', name: 'SHREEVATHASA S' },
  '175EC25305': { register_number: '175EC25305', name: 'YASHWANTH M' },
  '175EC25401': { register_number: '175EC25401', name: 'YATHISH KUMAR B N' },
};

export function getStudentRosterEntry(registerNumber: string) {
  return STUDENT_ROSTER[normalizeRegisterNumber(registerNumber)] ?? null;
}

export async function loginOrCreateStudent(registerNumber: string) {
  if (!supabase) throw new Error('Supabase settings are missing.');
  const normalized = normalizeRegisterNumber(registerNumber);
  if (!normalized || normalized.length < 2 || normalized.length > 50) throw new Error('Please enter a valid register number.');
  const { data, error } = await supabase.from('student_progress').upsert({ register_number: normalized }, { onConflict: 'register_number' }).select('register_number, completed_experiment_ids, experiment_status, updated_at').single();
  if (error) throw error;
  await logStudentActivity(normalized, 'login');
  return data as StudentProgressRecord;
}

export async function loadStudentProgress(registerNumber: string) {
  if (!supabase) throw new Error('Supabase settings are missing.');
  const normalized = normalizeRegisterNumber(registerNumber);
  const { data, error } = await supabase.from('student_progress').select('register_number, completed_experiment_ids, experiment_status, updated_at').eq('register_number', normalized).single();
  if (error) throw error;
  return data as StudentProgressRecord;
}

export async function saveStudentProgress(registerNumber: string, completedIds: string[], statusMap: ExperimentStatusMap = {}) {
  if (!supabase) throw new Error('Supabase settings are missing.');
  const normalized = normalizeRegisterNumber(registerNumber);
  const cleanStatuses = { ...statusMap };
  for (const id of completedIds) cleanStatuses[id] = 'completed';
  const { error } = await supabase.from('student_progress').upsert({ register_number: normalized, completed_experiment_ids: Array.from(new Set(completedIds)), experiment_status: cleanStatuses, updated_at: new Date().toISOString() }, { onConflict: 'register_number' });
  if (error) throw error;
}

export async function logStudentActivity(registerNumber: string, action: string, experimentId?: string, metadata: Record<string, unknown> = {}) {
  if (!supabase) return;
  await supabase.from('student_activity').insert({ register_number: normalizeRegisterNumber(registerNumber), action, experiment_id: experimentId ?? null, metadata });
}
