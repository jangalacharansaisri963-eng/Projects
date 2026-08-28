import React from 'react';
import { PotItem } from '../types';

interface HandDrawnPotProps {
  pot: PotItem;
  moisturePercent: number;
}

export const HandDrawnPot: React.FC<HandDrawnPotProps> = ({ pot, moisturePercent }) => {
  // Soil color darkens realistically when watered
  const soilFill = moisturePercent > 50 ? '#3A2010' : (moisturePercent > 20 ? '#54331C' : '#7D583B');
  const soilMoistGleam = moisturePercent > 70;

  const renderPotStyle = () => {
    switch (pot.style) {
      case 'pastel_glaze':
        return (
          <g>
            {/* Smooth Ceramic Pot Body */}
            <path
              d="M38,30 L162,30 L145,108 Q100,118 55,108 Z"
              fill={pot.baseColor}
              stroke="#2E4A1C"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Pastel Glaze Drips / Waves */}
            <path
              d="M38,30 Q60,65 90,45 Q125,75 162,30 L162,30 L38,30 Z"
              fill={pot.patternColor}
              opacity="0.85"
            />
            {/* Soft highlight */}
            <path d="M52,38 Q48,70 60,95" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.4" fill="none" />
          </g>
        );

      case 'mossy_stone':
        return (
          <g>
            {/* Rough Stone Pot Body */}
            <path
              d="M36,28 Q100,24 164,28 L148,110 Q100,115 52,110 Z"
              fill={pot.baseColor}
              stroke="#292524"
              strokeWidth="4"
            />
            {/* Stone Cracks */}
            <path d="M70,45 L85,60 L80,75" stroke="#44403C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M130,55 L120,70 L125,85" stroke="#44403C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Velvet Green Moss patches */}
            <path d="M42,32 Q55,42 68,34 Q58,50 46,45 Z" fill="#65A30D" stroke="#365314" strokeWidth="1.5" />
            <path d="M130,95 Q145,85 142,108 Q130,112 125,100 Z" fill="#4D7C0F" stroke="#365314" strokeWidth="1.5" />
          </g>
        );

      case 'wooden_cask':
        return (
          <g>
            {/* Cedar Staves Body */}
            <path
              d="M35,30 Q100,26 165,30 L146,110 Q100,116 54,110 Z"
              fill={pot.baseColor}
              stroke="#291807"
              strokeWidth="4"
            />
            {/* Woodgrain Slats */}
            <line x1="72" y1="30" x2="66" y2="110" stroke="#451A03" strokeWidth="2.5" />
            <line x1="100" y1="28" x2="100" y2="112" stroke="#451A03" strokeWidth="2.5" />
            <line x1="128" y1="30" x2="134" y2="110" stroke="#451A03" strokeWidth="2.5" />
            {/* Black Iron Hoops */}
            <path d="M38,52 Q100,48 162,52 L160,60 Q100,56 40,60 Z" fill="#292524" stroke="#1C1917" strokeWidth="1.5" />
            <path d="M46,88 Q100,84 154,88 L152,95 Q100,91 48,95 Z" fill="#292524" stroke="#1C1917" strokeWidth="1.5" />
            {/* Golden Rivets */}
            <circle cx="58" cy="56" r="2.5" fill="#CA8A04" />
            <circle cx="100" cy="54" r="2.5" fill="#CA8A04" />
            <circle cx="142" cy="56" r="2.5" fill="#CA8A04" />
          </g>
        );

      case 'celestial_star':
        return (
          <g>
            {/* Deep Midnight Vessel */}
            <path
              d="M36,28 L164,28 L146,110 Q100,120 54,110 Z"
              fill={pot.baseColor}
              stroke="#312E81"
              strokeWidth="4"
            />
            {/* Glowing Nebula Sheen */}
            <ellipse cx="100" cy="65" rx="45" ry="30" fill="#4338CA" opacity="0.6" />
            {/* Constellation Gold Inlays */}
            <circle cx="70" cy="55" r="3" fill="#FDE047" />
            <circle cx="95" cy="72" r="3" fill="#FDE047" />
            <circle cx="130" cy="50" r="3.5" fill="#FDE047" />
            <circle cx="115" cy="90" r="2.5" fill="#FDE047" />
            <line x1="70" y1="55" x2="95" y2="72" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="95" y1="72" x2="130" y2="50" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="95" y1="72" x2="115" y2="90" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="2 2" />
            {/* Crescent Moon Emblem */}
            <path d="M96,40 A6,6 0 0 0 104,48 A4.5,4.5 0 0 1 96,40 Z" fill="#FEF08A" />
          </g>
        );

      case 'porcelain_wave':
        return (
          <g>
            {/* Translucent Ivory Porcelain Body */}
            <path
              d="M38,30 L162,30 L146,108 Q100,118 54,108 Z"
              fill={pot.baseColor}
              stroke="#0369A1"
              strokeWidth="3.5"
            />
            {/* Japanese Wave Patterns */}
            <path d="M50,65 Q65,45 80,65 Q95,45 110,65 Q125,45 140,65 Q150,55 155,65" stroke={pot.patternColor} strokeWidth="3" fill="none" />
            <path d="M55,85 Q70,65 85,85 Q100,65 115,85 Q130,65 145,85" stroke={pot.patternColor} strokeWidth="2.5" fill="none" />
          </g>
        );

      case 'golden_filigree':
        return (
          <g>
            {/* Polished Marble Body */}
            <path
              d="M38,30 L162,30 L144,110 Q100,122 56,110 Z"
              fill={pot.baseColor}
              stroke="#92400E"
              strokeWidth="3.5"
            />
            {/* Golden Filigree Leaf Crest */}
            <path d="M100,45 Q80,60 70,80 Q90,75 100,90 Q110,75 130,80 Q120,60 100,45 Z" fill="#FDE047" stroke="#B45309" strokeWidth="2" />
            <circle cx="100" cy="65" r="4" fill="#EF4444" />
          </g>
        );

      case 'hanging_macrame':
        return (
          <g>
            {/* Suspended Cotton Ropes */}
            <line x1="25" y1="0" x2="45" y2="35" stroke="#D6D3D1" strokeWidth="3.5" strokeDasharray="3 2" />
            <line x1="175" y1="0" x2="155" y2="35" stroke="#D6D3D1" strokeWidth="3.5" strokeDasharray="3 2" />
            {/* Terra pot basket */}
            <path
              d="M45,35 L155,35 L140,95 Q100,105 60,95 Z"
              fill="#E7E5E4"
              stroke="#78716C"
              strokeWidth="3.5"
            />
            {/* Macrame Knot patterns */}
            <path d="M45,35 L100,70 L155,35" stroke="#A8A29E" strokeWidth="3" fill="none" />
            <path d="M60,95 L100,70 L140,95" stroke="#A8A29E" strokeWidth="3" fill="none" />
            {/* Bottom Tassels */}
            <line x1="85" y1="100" x2="80" y2="125" stroke="#D6D3D1" strokeWidth="3" strokeLinecap="round" />
            <line x1="100" y1="102" x2="100" y2="132" stroke="#D6D3D1" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="115" y1="100" x2="120" y2="125" stroke="#D6D3D1" strokeWidth="3" strokeLinecap="round" />
          </g>
        );

      case 'terracotta':
      default:
        return (
          <g>
            {/* Terracotta Pot Body */}
            <path
              d="M38,30 L162,30 L145,108 Q100,118 55,108 Z"
              fill={pot.baseColor}
              stroke="#7C2D12"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Terracotta Wide Top Collar Rim */}
            <rect
              x="30"
              y="18"
              width="140"
              height="16"
              rx="5"
              fill="#EA580C"
              stroke="#7C2D12"
              strokeWidth="3.5"
            />
            {/* Hand-drawn chalk markings / texture */}
            <path d="M50,45 Q70,40 100,44 Q130,40 150,45" stroke="#FED7AA" strokeWidth="2.5" fill="none" opacity="0.6" strokeDasharray="4 4" />
            <path d="M55,60 Q80,55 100,59 Q120,55 145,60" stroke="#FED7AA" strokeWidth="2.5" fill="none" opacity="0.6" strokeDasharray="4 4" />
            {/* Clay shading shadow */}
            <path d="M125,32 L144,106 Q125,112 110,112 L115,32 Z" fill="#9A3412" opacity="0.45" />
          </g>
        );
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-start pointer-events-none">
      <svg viewBox="0 0 200 135" className="w-full h-full overflow-visible">
        {/* Soil Bed Ellipse (Top opening of the pot) */}
        <ellipse
          cx="100"
          cy="26"
          rx="58"
          ry="14"
          fill={soilFill}
          stroke="#271306"
          strokeWidth="3.5"
        />

        {/* Moisture Gleam on soil if damp */}
        {soilMoistGleam && (
          <ellipse
            cx="90"
            cy="24"
            rx="35"
            ry="7"
            fill="#60A5FA"
            opacity="0.35"
            className="animate-pulse"
          />
        )}

        {/* Pot Structure */}
        {renderPotStyle()}

        {/* Hand-drawn Saucer / Base Shadow */}
        <ellipse
          cx="100"
          cy="118"
          rx="60"
          ry="10"
          fill="#3E2514"
          opacity="0.25"
        />
      </svg>
    </div>
  );
};
