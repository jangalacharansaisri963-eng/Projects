import React, { useState } from 'react';
import { X, Volume2, VolumeX, Music, Sliders, Wind, CloudRain, Disc3, Sparkles } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface AudioControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMusicPlaying: boolean;
  onToggleAudio: () => void;
  onChangePreset: (preset: 'cozy_chords' | 'rain_kalimba' | 'wind_chimes' | 'zen_bowl') => void;
}

export const AudioControlsModal: React.FC<AudioControlsModalProps> = ({
  isOpen,
  onClose,
  isMusicPlaying,
  onToggleAudio,
  onChangePreset,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<'cozy_chords' | 'rain_kalimba' | 'wind_chimes' | 'zen_bowl'>('cozy_chords');
  const [musicVol, setMusicVol] = useState(0.4);
  const [sfxVol, setSfxVol] = useState(0.6);

  if (!isOpen) return null;

  const presets = [
    {
      id: 'cozy_chords' as const,
      name: 'Cozy Morning Rhodes',
      description: 'Lofi acoustic progressions (Cmaj7, Am9, Fmaj7) with warm analog low-pass filters.',
      icon: <Music className="w-5 h-5 text-amber-600" />,
      color: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    },
    {
      id: 'rain_kalimba' as const,
      name: 'Rainy Conservatory Kalimba',
      description: 'Gentle raindrops falling on glass panes paired with tender thumb piano tines.',
      icon: <CloudRain className="w-5 h-5 text-blue-600" />,
      color: 'bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]',
    },
    {
      id: 'wind_chimes' as const,
      name: 'Breeze & Alpine Chimes',
      description: 'High pentatonic bells ringing softly as afternoon breeze rustles garden leaves.',
      icon: <Wind className="w-5 h-5 text-emerald-600" />,
      color: 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]',
    },
    {
      id: 'zen_bowl' as const,
      name: '432Hz Zen Sanctuary Bowl',
      description: 'Deep resonant Tibetan singing bowl drones for deep peaceful mindfulness.',
      icon: <Disc3 className="w-5 h-5 text-indigo-600" />,
      color: 'bg-[#EDE9FE] text-[#5B21B6] border-[#DDD6FE]',
    },
  ];

  const handleSelectPreset = (presetId: 'cozy_chords' | 'rain_kalimba' | 'wind_chimes' | 'zen_bowl') => {
    setSelectedPreset(presetId);
    onChangePreset(presetId);
    if (!isMusicPlaying) {
      onToggleAudio();
    }
  };

  const handleVolumeChange = (musicVal: number, sfxVal: number) => {
    setMusicVol(musicVal);
    setSfxVol(sfxVal);
    audioSynth.setVolume(musicVal, sfxVal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FCFAF6] border-2 border-[#D8CFC0] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-[#F7F3EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#84CC16] to-[#4D7C0F] flex items-center justify-center text-white shadow-xs">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-comfort font-bold text-lg text-[#3E342B]">
                Soothing Soundscape Radio
              </h3>
              <p className="text-xs text-[#7C7063] font-medium font-hand">
                Procedural peaceful music &amp; organic garden acoustics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EAE3D5] text-[#7C7063] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Main Play/Pause Big Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F7F3EB] border border-[#DDD3C2]">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${isMusicPlaying ? 'bg-[#84CC16] text-white animate-pulse' : 'bg-[#E5DEC9] text-[#7C7063]'}`}>
                {isMusicPlaying ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-comfort font-bold text-sm text-[#3E342B]">
                  {isMusicPlaying ? 'Music is Active' : 'Music is Muted'}
                </h4>
                <p className="text-xs text-[#7C7063]">
                  {isMusicPlaying ? 'Relaxing chord progression looping' : 'Tap to start tranquil harmonies'}
                </p>
              </div>
            </div>

            <button
              onClick={onToggleAudio}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isMusicPlaying
                  ? 'bg-[#EF4444] hover:bg-[#DC2626] text-white'
                  : 'bg-[#84CC16] hover:bg-[#65A30D] text-white'
              }`}
            >
              {isMusicPlaying ? 'Pause Audio' : 'Play Music'}
            </button>
          </div>

          {/* Preset Choices */}
          <div className="space-y-2.5">
            <label className="font-comfort font-bold text-xs text-[#3E342B] uppercase tracking-wider block">
              Soundscape Atmosphere
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {presets.map((p) => {
                const isSelected = selectedPreset === p.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#EBF7E5] border-2 border-[#65A30D] shadow-xs'
                        : 'bg-[#F7F3EB] hover:bg-[#EFE9DD] border-[#DDD3C2]'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${p.color} shrink-0`}>
                      {p.icon}
                    </div>
                    <div>
                      <h5 className="font-comfort font-bold text-sm text-[#3E342B]">
                        {p.name}
                      </h5>
                      <p className="text-xs text-[#554A3E] leading-relaxed mt-0.5">
                        {p.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume Tuning Sliders */}
          <div className="space-y-3 pt-2 border-t border-[#E8E2D5]">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[#4A4036] mb-1">
                <span>Music Volume</span>
                <span>{Math.round(musicVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVol}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value), sfxVol)}
                className="w-full accent-[#84CC16] h-1.5 bg-[#E5DEC9] rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[#4A4036] mb-1">
                <span>Sound FX (Watering, Digging, Chimes)</span>
                <span>{Math.round(sfxVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVol}
                onChange={(e) => handleVolumeChange(musicVol, parseFloat(e.target.value))}
                className="w-full accent-[#84CC16] h-1.5 bg-[#E5DEC9] rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
