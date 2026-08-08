import { ThemeMode } from '../types';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  bgClass: string;
  cardClass: string;
  boardBg: string;
  gridBorder: string;
  cellClass: string;
  cellHover: string;
  colorX: string;
  colorO: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  winLineColor: string;
}

export const THEMES: Record<ThemeMode, ThemeConfig> = {
  dark: {
    id: 'dark',
    name: 'Modern Dark',
    bgClass: 'bg-slate-950 text-slate-100',
    cardClass: 'bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl',
    boardBg: 'bg-slate-900/90 border border-slate-800 shadow-2xl shadow-indigo-950/40',
    gridBorder: 'border-slate-800',
    cellClass: 'bg-slate-800/60 hover:bg-slate-800/90 text-slate-100',
    cellHover: 'hover:border-indigo-500/50',
    colorX: 'text-indigo-400 drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]',
    colorO: 'text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    accent: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30',
    winLineColor: '#818cf8',
  },
  light: {
    id: 'light',
    name: 'Minimal Light',
    bgClass: 'bg-slate-50 text-slate-900',
    cardClass: 'bg-white border border-slate-200/80 shadow-md',
    boardBg: 'bg-white border border-slate-200 shadow-xl shadow-slate-200/50',
    gridBorder: 'border-slate-200',
    cellClass: 'bg-slate-100/70 hover:bg-slate-100 text-slate-900',
    cellHover: 'hover:border-slate-400',
    colorX: 'text-blue-600',
    colorO: 'text-emerald-600',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-500',
    accent: 'bg-slate-900 hover:bg-slate-800 text-white shadow-md',
    winLineColor: '#2563eb',
  },
  neon: {
    id: 'neon',
    name: 'Neon Cyberpunk',
    bgClass: 'bg-black text-cyan-400',
    cardClass: 'bg-gray-950 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)]',
    boardBg: 'bg-gray-950 border-2 border-cyan-500/50 shadow-[0_0_35px_rgba(6,182,212,0.25)]',
    gridBorder: 'border-cyan-500/30',
    cellClass: 'bg-gray-900/80 hover:bg-cyan-950/40 text-cyan-300',
    cellHover: 'hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]',
    colorX: 'text-cyan-400 drop-shadow-[0_0_16px_rgba(34,211,238,0.9)]',
    colorO: 'text-fuchsia-400 drop-shadow-[0_0_16px_rgba(232,121,249,0.9)]',
    textPrimary: 'text-cyan-300',
    textSecondary: 'text-cyan-600',
    accent: 'bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    winLineColor: '#22d3ee',
  },
  pastel: {
    id: 'pastel',
    name: 'Sunset Pastel',
    bgClass: 'bg-amber-50/60 text-stone-800',
    cardClass: 'bg-white/80 border border-amber-200/60 shadow-lg shadow-amber-900/5',
    boardBg: 'bg-white border border-amber-200 shadow-xl shadow-amber-100/60',
    gridBorder: 'border-amber-200/80',
    cellClass: 'bg-amber-50/80 hover:bg-amber-100/60 text-stone-800',
    cellHover: 'hover:border-amber-300',
    colorX: 'text-rose-500',
    colorO: 'text-teal-600',
    textPrimary: 'text-stone-800',
    textSecondary: 'text-stone-500',
    accent: 'bg-teal-700 hover:bg-teal-600 text-white shadow-md shadow-teal-700/20',
    winLineColor: '#f43f5e',
  },
  chalkboard: {
    id: 'chalkboard',
    name: 'Chalkboard',
    bgClass: 'bg-zinc-900 text-zinc-100',
    cardClass: 'bg-zinc-800/90 border border-zinc-700 shadow-2xl',
    boardBg: 'bg-zinc-950 border-4 border-amber-900/80 shadow-2xl shadow-black/80',
    gridBorder: 'border-zinc-700/60',
    cellClass: 'bg-zinc-900/90 hover:bg-zinc-800/90 text-zinc-100',
    cellHover: 'hover:border-amber-500/40',
    colorX: 'text-amber-200 font-serif drop-shadow-[0_0_8px_rgba(253,230,138,0.4)]',
    colorO: 'text-emerald-300 font-serif drop-shadow-[0_0_8px_rgba(110,231,183,0.4)]',
    textPrimary: 'text-zinc-100',
    textSecondary: 'text-zinc-400',
    accent: 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/30',
    winLineColor: '#fde68a',
  },
};
