import React from 'react';

interface SpiralNotepadProps {
  children: React.ReactNode;
  ringCount?: number;
  className?: string;
  id?: string;
}

export const SpiralNotepad: React.FC<SpiralNotepadProps> = ({
  children,
  ringCount = 5,
  className = '',
  id,
}) => {
  return (
    <div
      id={id}
      className={`relative bg-white rounded-3xl shadow-2xl border-b-4 border-slate-200 pt-6 px-5 pb-6 flex flex-col items-center select-none ${className}`}
    >
      {/* Top Spiral Rings */}
      <div className="absolute -top-3 left-0 right-0 flex justify-around px-4 pointer-events-none z-20">
        {Array.from({ length: ringCount }).map((_, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {/* The Metal Ring Loop */}
            <div className="w-3.5 h-6 rounded-full spiral-ring border border-slate-300 transform -rotate-6" />
            {/* The Hole in the paper */}
            <div className="w-2.5 h-2.5 rounded-full bg-sky-200/90 shadow-inner -mt-1.5" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="w-full flex flex-col items-center mt-1">
        {children}
      </div>
    </div>
  );
};
