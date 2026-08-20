import React, { useState, useRef, useEffect } from 'react';
import { TerminalLog } from '../types';
import { sound } from '../utils/audio';
import { Terminal, Send, HelpCircle, Play, ShoppingBag, Shield, Cpu, RefreshCw } from 'lucide-react';

interface TerminalViewProps {
  logs: TerminalLog[];
  onExecuteCommand: (cmd: string) => void;
  terminalTheme: 'matrix' | 'amber' | 'cyan' | 'blood' | 'ghost';
  onQuickAction: (action: string) => void;
}

export const TerminalView: React.FC<TerminalViewProps> = ({
  logs,
  onExecuteCommand,
  terminalTheme,
  onQuickAction
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sound.playKeyClick();
    const cmd = input.trim();
    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput('');
    onExecuteCommand(cmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    sound.playKeyClick();
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex] || '');
      }
    }
  };

  const getThemeStyles = () => {
    switch (terminalTheme) {
      case 'amber':
        return {
          bg: 'bg-zinc-950',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          prompt: 'text-amber-500',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
          accent: 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
        };
      case 'cyan':
        return {
          bg: 'bg-slate-950',
          border: 'border-cyan-500/40',
          text: 'text-cyan-400',
          prompt: 'text-cyan-300',
          glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]',
          accent: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20'
        };
      case 'blood':
        return {
          bg: 'bg-neutral-950',
          border: 'border-rose-600/40',
          text: 'text-rose-400',
          prompt: 'text-rose-500',
          glow: 'shadow-[0_0_20px_rgba(225,29,72,0.15)]',
          accent: 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
        };
      case 'ghost':
        return {
          bg: 'bg-neutral-950',
          border: 'border-neutral-700',
          text: 'text-neutral-200',
          prompt: 'text-emerald-400',
          glow: 'shadow-[0_0_20px_rgba(255,255,255,0.05)]',
          accent: 'bg-neutral-800 text-neutral-200 border-neutral-700 hover:bg-neutral-700'
        };
      case 'matrix':
      default:
        return {
          bg: 'bg-black',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          prompt: 'text-emerald-300',
          glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
          accent: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div
      id="terminal-container"
      className={`flex flex-col h-full rounded-xl border ${theme.border} ${theme.bg} ${theme.glow} font-mono overflow-hidden transition-all duration-300 relative`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40 z-10" />

      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/90 border-b border-neutral-800/80 z-20 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-xs tracking-wider font-semibold text-neutral-300 flex items-center gap-1.5 ml-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            bash / dan_studios_v102 / code_heist.py
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
          <span className="hidden sm:inline bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">
            Python 3.12.0
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
            CONNECTED
          </span>
        </div>
      </div>

      {/* Quick Action Toolbar */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950/80 border-b border-neutral-800/60 overflow-x-auto text-xs z-20 scrollbar-none">
        <span className="text-[11px] text-neutral-400 font-medium mr-1 whitespace-nowrap">
          Quick Actions:
        </span>
        <button
          id="btn-quick-run-bank"
          onClick={(e) => { e.stopPropagation(); onQuickAction('heist bank_server'); }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-medium transition-all ${theme.accent} whitespace-nowrap`}
        >
          <Play className="w-3 h-3" /> Heist Bank
        </button>
        <button
          id="btn-quick-run-python"
          onClick={(e) => { e.stopPropagation(); onQuickAction('python main.py'); }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-medium transition-all ${theme.accent} whitespace-nowrap`}
        >
          <Cpu className="w-3 h-3" /> python main.py
        </button>
        <button
          id="btn-quick-mask"
          onClick={(e) => { e.stopPropagation(); onQuickAction('mask_ip'); }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-medium transition-all ${theme.accent} whitespace-nowrap`}
        >
          <Shield className="w-3 h-3" /> mask_ip()
        </button>
        <button
          id="btn-quick-shop"
          onClick={(e) => { e.stopPropagation(); onQuickAction('shop'); }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-medium transition-all ${theme.accent} whitespace-nowrap`}
        >
          <ShoppingBag className="w-3 h-3" /> Shop
        </button>
        <button
          id="btn-quick-help"
          onClick={(e) => { e.stopPropagation(); onQuickAction('help'); }}
          className={`flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-medium transition-all ${theme.accent} whitespace-nowrap`}
        >
          <HelpCircle className="w-3 h-3" /> help
        </button>
        <button
          id="btn-quick-clear"
          onClick={(e) => { e.stopPropagation(); onQuickAction('clear'); }}
          className="flex items-center gap-1 px-2 py-1 rounded border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 text-[11px] transition-all whitespace-nowrap ml-auto"
        >
          <RefreshCw className="w-3 h-3" /> clear
        </button>
      </div>

      {/* Terminal Output Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-1.5 text-xs sm:text-sm z-20 selection:bg-emerald-500 selection:text-black">
        {logs.map((log) => {
          if (log.type === 'ascii') {
            return (
              <pre
                key={log.id}
                className="text-[10px] sm:text-xs leading-tight font-bold text-emerald-400 whitespace-pre overflow-x-auto py-1"
              >
                {log.text}
              </pre>
            );
          }

          if (log.type === 'cmd') {
            return (
              <div key={log.id} className="flex items-center gap-2 font-semibold text-neutral-200 mt-2">
                <span className={theme.prompt}>user@dan-heist:~$</span>
                <span className="text-white bg-neutral-800/80 px-1.5 py-0.5 rounded">{log.text}</span>
              </div>
            );
          }

          let colorClass = theme.text;
          if (log.type === 'error') colorClass = 'text-rose-400 font-bold';
          if (log.type === 'warning') colorClass = 'text-amber-400';
          if (log.type === 'success') colorClass = 'text-emerald-300 font-semibold';
          if (log.type === 'trace') colorClass = 'text-red-500 animate-pulse font-bold';

          return (
            <div key={log.id} className={`leading-relaxed break-words ${colorClass}`}>
              {log.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* CLI Input Prompt */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-3 bg-neutral-950 border-t border-neutral-800/80 z-20"
      >
        <span className={`font-bold text-sm select-none ${theme.prompt}`}>
          user@dan-heist:~$
        </span>
        <input
          id="terminal-input"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command (e.g. 'heist bank_server', 'python main.py', 'shop', 'help')..."
          className="flex-1 bg-transparent text-neutral-100 placeholder-neutral-600 focus:outline-none text-xs sm:text-sm font-mono"
          autoFocus
        />
        <button
          type="submit"
          className={`p-1.5 rounded-lg border transition-all ${theme.accent}`}
          title="Send command (Enter)"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
