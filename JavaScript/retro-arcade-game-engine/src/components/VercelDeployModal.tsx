/**
 * Vercel Deployment Manager & Configuration Modal
 */

import React, { useState } from 'react';
import {
  X,
  Rocket,
  Terminal,
  FileCode,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Globe,
  Download,
  Settings,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'cli' | 'config' | 'settings'>('quick');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const vercelJsonContent = JSON.stringify(
    {
      framework: 'vite',
      buildCommand: 'npm run build',
      outputDirectory: 'dist',
      cleanUrls: true,
      trailingSlash: false,
      rewrites: [
        {
          source: '/(.*)',
          destination: '/index.html',
        },
      ],
      headers: [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
          ],
        },
        {
          source: '/assets/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ],
    },
    null,
    2
  );

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleDownloadConfig = () => {
    const blob = new Blob([vercelJsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vercel.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl p-5 shadow-2xl shadow-black/90 flex flex-col gap-4 text-slate-100 max-h-[90vh] overflow-y-auto ring-1 ring-white/10 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            {/* Vercel Triangle Icon */}
            <div className="w-7 h-7 rounded-lg bg-black border border-slate-700 flex items-center justify-center shadow-md">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12 1L24 22H0L12 1Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider text-slate-100 font-mono flex items-center gap-2">
                DEPLOY TO VERCEL
                <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 uppercase font-semibold">
                  PRODUCTION READY
                </span>
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Vite SPA Preset • Global Edge CDN • vercel.json Configured
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 font-mono text-[11px]">
          <button
            onClick={() => setActiveTab('quick')}
            className={`py-1.5 px-2 rounded-md font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'quick'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1-Click</span> Deploy
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`py-1.5 px-2 rounded-md font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'cli'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vercel</span> CLI
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`py-1.5 px-2 rounded-md font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'config'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            vercel.json
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-1.5 px-2 rounded-md font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Project</span> Specs
          </button>
        </div>

        {/* Tab 1: 1-Click Quick Deploy & GitHub */}
        {activeTab === 'quick' && (
          <div className="flex flex-col gap-3 font-mono text-xs">
            {/* Primary Action Banner */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-400" /> Vercel Cloud Deployment
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Deploy this complete Retro Arcade Engine instantly to Vercel's global edge network with zero server dependencies.
                </p>
              </div>

              <a
                href="https://vercel.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-black font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-white/10"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-black">
                  <path d="M12 1L24 22H0L12 1Z" />
                </svg>
                <span>OPEN VERCEL DASHBOARD</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Step-by-step GitHub workflow */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2.5">
              <span className="text-[11px] text-slate-300 font-bold flex items-center gap-1.5 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 3-Step Continuous Deployment Workflow
              </span>

              <div className="space-y-2 text-[11px] text-slate-300">
                <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-white">Export or Push to GitHub:</span>
                    <p className="text-slate-400 text-[10px] mt-0.5">
                      Export this project repository or commit it to your GitHub/GitLab account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-white">Import Repository on Vercel:</span>
                    <p className="text-slate-400 text-[10px] mt-0.5">
                      Go to <code className="text-sky-300">vercel.com/new</code>, select your repo, and Vercel will automatically detect the <strong>Vite</strong> framework preset.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    3
                  </span>
                  <div>
                    <span className="font-bold text-white">Click "Deploy":</span>
                    <p className="text-slate-400 text-[10px] mt-0.5">
                      Vercel will run <code className="text-emerald-300">npm run build</code> and publish your site with custom domains, automated SSL, and preview branches on every git push.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Production Readiness Status */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
              <span className="text-[11px] text-slate-300 font-bold flex items-center gap-1.5 uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Pre-Flight Production Checks
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/20 border border-emerald-800/30 p-2 rounded-lg">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Build Target: Vite Static SPA</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/20 border border-emerald-800/30 p-2 rounded-lg">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Config: vercel.json in Root</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/20 border border-emerald-800/30 p-2 rounded-lg">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>100% Offline Audio & Physics</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/20 border border-emerald-800/30 p-2 rounded-lg">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>SPA Rewrites & Asset Caching Configured</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Vercel CLI Instructions */}
        {activeTab === 'cli' && (
          <div className="flex flex-col gap-3 font-mono text-xs">
            <p className="text-slate-300 text-[11px]">
              You can deploy this project from your terminal in seconds using the official Vercel CLI tool:
            </p>

            {/* Step 1: Install CLI */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-bold">1. Install Vercel CLI globally</span>
                <button
                  onClick={() => copyToClipboard('npm i -g vercel', 'npm-cli')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 transition"
                >
                  {copiedKey === 'npm-cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'npm-cli' ? 'COPIED' : 'COPY'}
                </button>
              </div>
              <div className="bg-black/70 rounded-lg p-2.5 text-sky-400 border border-slate-800 font-mono text-[11px]">
                <code>npm i -g vercel</code>
              </div>
            </div>

            {/* Step 2: Login */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-bold">2. Authenticate CLI</span>
                <button
                  onClick={() => copyToClipboard('vercel login', 'login-cli')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 transition"
                >
                  {copiedKey === 'login-cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'login-cli' ? 'COPIED' : 'COPY'}
                </button>
              </div>
              <div className="bg-black/70 rounded-lg p-2.5 text-sky-400 border border-slate-800 font-mono text-[11px]">
                <code>vercel login</code>
              </div>
            </div>

            {/* Step 3: Deploy Production */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-bold">3. Deploy directly to Production</span>
                <button
                  onClick={() => copyToClipboard('vercel --prod', 'prod-cli')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 transition"
                >
                  {copiedKey === 'prod-cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'prod-cli' ? 'COPIED' : 'COPY'}
                </button>
              </div>
              <div className="bg-black/70 rounded-lg p-2.5 text-emerald-400 border border-slate-800 font-mono text-[11px]">
                <code>vercel --prod</code>
              </div>
            </div>

            {/* All in one command */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
              <span className="text-slate-400 text-[10px]">Quick one-liner:</span>
              <button
                onClick={() => copyToClipboard('npx vercel --prod', 'npx-oneliner')}
                className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
              >
                {copiedKey === 'npx-oneliner' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>COPY: npx vercel --prod</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: vercel.json File Viewer */}
        {activeTab === 'config' && (
          <div className="flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-[11px]">Root Configuration File (<code className="text-sky-300">/vercel.json</code>):</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadConfig}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] flex items-center gap-1.5 transition border border-slate-700"
                  title="Download vercel.json"
                >
                  <Download className="w-3 h-3 text-sky-400" />
                  <span>DOWNLOAD</span>
                </button>
                <button
                  onClick={() => copyToClipboard(vercelJsonContent, 'config-json')}
                  className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[10px] flex items-center gap-1.5 transition"
                >
                  {copiedKey === 'config-json' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'config-json' ? 'COPIED' : 'COPY JSON'}</span>
                </button>
              </div>
            </div>

            <div className="bg-black/80 rounded-xl p-3.5 border border-slate-800 text-[11px] overflow-x-auto max-h-64 scrollbar-thin text-slate-300">
              <pre>
                <code>{vercelJsonContent}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: Vercel Project Specs & Settings */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-3 font-mono text-xs">
            <span className="text-slate-300 text-[11px]">
              Vercel Project Configuration Matrix:
            </span>

            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/70 text-[11px]">
              <div className="grid grid-cols-12 p-2.5 items-center">
                <span className="col-span-5 text-slate-400 font-bold">Framework Preset</span>
                <span className="col-span-7 text-sky-400 font-bold">Vite</span>
              </div>
              <div className="grid grid-cols-12 p-2.5 items-center">
                <span className="col-span-5 text-slate-400 font-bold">Build Command</span>
                <span className="col-span-7 text-emerald-400 font-bold">npm run build</span>
              </div>
              <div className="grid grid-cols-12 p-2.5 items-center">
                <span className="col-span-5 text-slate-400 font-bold">Output Directory</span>
                <span className="col-span-7 text-amber-400 font-bold">dist</span>
              </div>
              <div className="grid grid-cols-12 p-2.5 items-center">
                <span className="col-span-5 text-slate-400 font-bold">Install Command</span>
                <span className="col-span-7 text-slate-200">npm install</span>
              </div>
              <div className="grid grid-cols-12 p-2.5 items-center">
                <span className="col-span-5 text-slate-400 font-bold">Node.js Version</span>
                <span className="col-span-7 text-slate-200">20.x / 18.x</span>
              </div>
              <div className="grid grid-cols-12 p-2.5 items-center">
                <span className="col-span-5 text-slate-400 font-bold">Client Routing</span>
                <span className="col-span-7 text-slate-200">Single Page Application (SPA Fallback)</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between font-mono text-[10px]">
          <span className="text-slate-500">Auto-configured for instant static deployments</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
