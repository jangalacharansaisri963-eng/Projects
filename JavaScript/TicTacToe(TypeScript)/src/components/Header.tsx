import React from 'react';
import { Volume2, VolumeX, Palette, BarChart3, HelpCircle, RefreshCw, Github } from 'lucide-react';
import { ThemeConfig, THEMES } from '../utils/themes';
import { ThemeMode } from '../types';

interface HeaderProps {
  theme: ThemeConfig;
  onThemeChange: (theme: ThemeMode) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onOpenStats: () => void;
  onOpenRules: () => void;
  onResetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  soundEnabled,
  onSoundToggle,
  onOpenStats,
  onOpenRules,
  onResetAll,
}) => {
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);

  return (
    <header className="w-full max-w-2xl mx-auto flex items-center justify-between px-4 py-3 sm:py-4">
      {/* Brand Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
          XO
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5">
              Tic Tac Toe
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Pro AI
            </span>
          </div>
          <p className={`text-xs ${theme.textSecondary} hidden sm:block`}>
            Minimax AI &bull; Customizable Grid &bull; Interactive Themes
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Sound Toggle */}
        <button
          onClick={onSoundToggle}
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          className={`p-2 rounded-xl transition-all ${theme.cardClass} hover:opacity-90 active:scale-95`}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          )}
        </button>

        {/* Theme Picker Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            title="Change Theme"
            className={`p-2 rounded-xl transition-all ${theme.cardClass} hover:opacity-90 active:scale-95 flex items-center gap-1`}
          >
            <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
          </button>

          {showThemeMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowThemeMenu(false)}
              />
              <div
                className={`absolute right-0 mt-2 w-48 rounded-2xl p-2 z-30 ${theme.cardClass} shadow-2xl border backdrop-blur-xl`}
              >
                <div className={`px-2 py-1 text-xs font-bold ${theme.textSecondary} uppercase tracking-wider mb-1`}>
                  Select Theme
                </div>
                {(Object.keys(THEMES) as ThemeMode[]).map((mode) => {
                  const t = THEMES[mode];
                  return (
                    <button
                      key={mode}
                      onClick={() => {
                        onThemeChange(mode);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                        theme.id === mode
                          ? 'bg-indigo-600 text-white font-semibold shadow-md'
                          : `hover:bg-slate-800/50 ${theme.textPrimary}`
                      }`}
                    >
                      {t.name}
                      <span className="flex gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Stats Button */}
        <button
          onClick={onOpenStats}
          title="View Statistics"
          className={`p-2 rounded-xl transition-all ${theme.cardClass} hover:opacity-90 active:scale-95`}
        >
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
        </button>

        {/* Rules Button */}
        <button
          onClick={onOpenRules}
          title="Game Rules"
          className={`p-2 rounded-xl transition-all ${theme.cardClass} hover:opacity-90 active:scale-95`}
        >
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
        </button>

        {/* Reset Quick Action */}
        <button
          onClick={onResetAll}
          title="Reset Match"
          className={`p-2 rounded-xl transition-all ${theme.cardClass} hover:opacity-90 active:scale-95`}
        >
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
        </button>
      </div>
    </header>
  );
};
