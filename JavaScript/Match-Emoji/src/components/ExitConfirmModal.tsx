import React from 'react';
import { SpiralNotepad } from './SpiralNotepad';
import { sound } from '../utils/audio';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xs transform transition-all scale-100">
        <SpiralNotepad ringCount={6} className="shadow-2xl py-8">
          <div className="my-3 text-center">
            <h2 className="text-2xl sm:text-3xl font-game font-extrabold text-slate-800 tracking-wider">
              CONFIRM EXIT!
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Do you really want to quit?
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6 w-full px-2">
            {/* YES Button (Green) */}
            <button
              id="exit-btn-yes"
              onClick={() => {
                sound.playClick();
                onConfirm();
              }}
              className="flex-1 py-3 px-4 rounded-2xl font-game font-bold text-white text-lg tracking-wider btn-glossy-green cursor-pointer"
            >
              YES
            </button>

            {/* NO Button (Red) */}
            <button
              id="exit-btn-no"
              onClick={() => {
                sound.playClick();
                onCancel();
              }}
              className="flex-1 py-3 px-4 rounded-2xl font-game font-bold text-white text-lg tracking-wider btn-glossy-red cursor-pointer"
            >
              NO
            </button>
          </div>
        </SpiralNotepad>
      </div>
    </div>
  );
};
