import React, { useState } from 'react';
import { DEFAULT_PYTHON_FILES, PythonFile } from '../data/scripts';
import { sound } from '../utils/audio';
import {
  FileCode2,
  Play,
  Copy,
  Check,
  RotateCcw,
  Terminal,
  Code2,
  FolderOpen
} from 'lucide-react';

interface PythonEditorProps {
  onRunScript: (scriptName: string, customCode?: string) => void;
  isExecuting: boolean;
}

export const PythonEditor: React.FC<PythonEditorProps> = ({
  onRunScript,
  isExecuting
}) => {
  const [selectedFile, setSelectedFile] = useState<string>('main.py');
  const [fileContents, setFileContents] = useState<Record<string, string>>({
    'main.py': DEFAULT_PYTHON_FILES['main.py'].code,
    'tools.py': DEFAULT_PYTHON_FILES['tools.py'].code,
    'levels.py': DEFAULT_PYTHON_FILES['levels.py'].code,
    'shop.py': DEFAULT_PYTHON_FILES['shop.py'].code
  });
  const [copied, setCopied] = useState<boolean>(false);

  const currentCode = fileContents[selectedFile] || '';

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updated = e.target.value;
    setFileContents(prev => ({ ...prev, [selectedFile]: updated }));
  };

  const handleReset = () => {
    sound.playKeyClick();
    setFileContents(prev => ({
      ...prev,
      [selectedFile]: DEFAULT_PYTHON_FILES[selectedFile]?.code || ''
    }));
  };

  const handleCopy = () => {
    sound.playKeyClick();
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = () => {
    sound.playKeyClick();
    onRunScript(selectedFile, currentCode);
  };

  return (
    <div id="python-ide-panel" className="space-y-3 font-mono flex flex-col h-full">
      {/* File Tabs & Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {Object.keys(DEFAULT_PYTHON_FILES).map((filename) => (
            <button
              key={filename}
              onClick={() => {
                sound.playKeyClick();
                setSelectedFile(filename);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFile === filename
                  ? 'bg-neutral-800 text-emerald-400 border border-neutral-700 shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              {filename}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs transition-all flex items-center gap-1"
            title="Copy script code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs transition-all flex items-center gap-1"
            title="Reset script to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            id="btn-run-ide-script"
            onClick={handleExecute}
            disabled={isExecuting}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)] disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'RUNNING...' : `python ${selectedFile}`}</span>
          </button>
        </div>
      </div>

      {/* Editor Description */}
      <div className="text-xs text-neutral-400 flex items-center justify-between px-1">
        <span>{DEFAULT_PYTHON_FILES[selectedFile]?.description}</span>
        <span className="text-neutral-500 text-[11px]">UTF-8 • Python 3</span>
      </div>

      {/* Code Area with Line Numbers */}
      <div className="flex-1 min-h-[360px] bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden flex flex-col relative">
        <textarea
          id="python-code-editor"
          value={currentCode}
          onChange={handleCodeChange}
          spellCheck={false}
          className="w-full h-full p-4 bg-transparent text-emerald-400 font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none selection:bg-emerald-500/30"
          placeholder="# Python script code..."
        />
      </div>
    </div>
  );
};
