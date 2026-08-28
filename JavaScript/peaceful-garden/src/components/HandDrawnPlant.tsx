import React from 'react';
import { PlantInstance, PlantSpecies } from '../types';

interface HandDrawnPlantProps {
  plant: PlantInstance;
  species: PlantSpecies;
  isHovered?: boolean;
}

export const HandDrawnPlant: React.FC<HandDrawnPlantProps> = ({
  plant,
  species,
  isHovered = false,
}) => {
  const { stage, moistureLevel, health, fertilizerLevel, weedsCount } = plant;
  const isWithered = stage === 'withered' || health < 25;
  const isThirsty = moistureLevel < 20;
  const isWellNourished = fertilizerLevel > 0;
  const isMature = stage === 'mature';

  // Wilt angle calculation if dry
  const droopTransform = isWithered ? 'rotate(18deg) scaleY(0.78)' : (isThirsty ? 'rotate(6deg) scaleY(0.92)' : 'none');
  const wiltFilter = isWithered ? 'saturate(0.3) brightness(0.85) sepia(0.3)' : (isThirsty ? 'saturate(0.7)' : 'none');

  // Render stage-specific graphics
  const renderPlantArt = () => {
    switch (stage) {
      case 'seed':
        return (
          <g className="animate-float">
            {/* Soil Mound */}
            <path
              d="M30,150 Q100,128 170,150 Q100,165 30,150"
              fill="#5C3A21"
              stroke="#3E2413"
              strokeWidth="3"
            />
            {/* Seed Pocket / Embryo Sprout */}
            <ellipse cx="100" cy="138" rx="14" ry="10" fill="#8D5B4C" stroke="#4A2F25" strokeWidth="2.5" transform="rotate(-15 100 138)" />
            <path d="M102,132 Q108,122 112,120" stroke="#78B159" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="114" cy="118" r="3.5" fill="#A7D572" stroke="#5E8E3E" strokeWidth="1.5" />
            {/* Hand-drawn seed label marker */}
            <line x1="60" y1="145" x2="60" y2="105" stroke="#D4A373" strokeWidth="4" strokeLinecap="round" />
            <rect x="35" y="85" width="50" height="24" rx="4" fill="#FEFAE0" stroke="#CCD5AE" strokeWidth="2" />
            <text x="60" y="101" fontSize="10" fontWeight="bold" fontFamily="Patrick Hand" textAnchor="middle" fill="#582F0E">
              {species.name.slice(0, 7)}..
            </text>
          </g>
        );

      case 'sprout':
        return (
          <g style={{ transform: droopTransform, filter: wiltFilter }}>
            {/* Curved Stem */}
            <path
              d="M100,145 Q96,115 100,95"
              stroke="#4E7C33"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Cotyledon Leaf Left */}
            <path
              d="M100,95 C75,80 70,105 100,105"
              fill="#7CB342"
              stroke="#33691E"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Cotyledon Leaf Right */}
            <path
              d="M100,95 C125,78 130,103 100,103"
              fill="#8BC34A"
              stroke="#33691E"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Tiny top growth bud */}
            <circle cx="100" cy="92" r="4" fill="#C5E1A5" stroke="#558B2F" strokeWidth="1.5" />
          </g>
        );

      case 'growing':
        return (
          <g className="animate-sway" style={{ transform: droopTransform, filter: wiltFilter }}>
            {/* Main Stem */}
            <path
              d="M100,145 Q92,100 100,60"
              stroke="#386623"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Lower Leaf Left */}
            <path
              d="M96,120 C60,110 50,135 96,132"
              fill="#558B2F"
              stroke="#2E4A1C"
              strokeWidth="2.5"
            />
            {/* Mid Leaf Right */}
            <path
              d="M98,98 C140,85 145,115 98,110"
              fill="#689F38"
              stroke="#2E4A1C"
              strokeWidth="2.5"
            />
            {/* Upper Leaf Left */}
            <path
              d="M99,75 C70,55 60,80 99,80"
              fill="#7CB342"
              stroke="#2E4A1C"
              strokeWidth="2.5"
            />
            {/* Budding floral cluster */}
            <circle cx="100" cy="56" r="10" fill={species.accentColor} stroke="#2E4A1C" strokeWidth="2.5" />
            <circle cx="100" cy="56" r="5" fill="#FEF08A" />
          </g>
        );

      case 'blooming':
      case 'mature':
      case 'withered':
      default:
        return renderSpeciesIllustration(species.illustrationType, isMature, isWithered, droopTransform, wiltFilter, species.accentColor);
    }
  };

  const renderSpeciesIllustration = (
    type: string,
    mature: boolean,
    withered: boolean,
    droop: string,
    wilt: string,
    accent: string
  ) => {
    switch (type) {
      case 'sunflower':
        return (
          <g className={withered ? '' : 'animate-sway'} style={{ transform: droop, filter: wilt }}>
            {/* Sturdy Stem */}
            <path d="M100,145 Q90,95 100,45" stroke="#3E6B27" strokeWidth="7" strokeLinecap="round" fill="none" />
            {/* Broad Leaves */}
            <path d="M96,115 C50,105 40,135 96,130" fill="#4D7C0F" stroke="#1E3A0B" strokeWidth="3" />
            <path d="M98,90 C150,75 160,110 98,105" fill="#65A30D" stroke="#1E3A0B" strokeWidth="3" />
            {/* Sunflower Golden Petals */}
            <g transform="translate(100, 45)">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                <path
                  key={i}
                  d="M0,0 Q-8,-26 0,-34 Q8,-26 0,0"
                  fill={i % 2 === 0 ? '#FBBF24' : '#F59E0B'}
                  stroke="#B45309"
                  strokeWidth="2"
                  transform={`rotate(${deg})`}
                />
              ))}
              {/* Seed Disk */}
              <circle cx="0" cy="0" r="16" fill="#78350F" stroke="#451A03" strokeWidth="3" />
              <circle cx="0" cy="0" r="10" fill="#92400E" stroke="#B45309" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Joyful face / spiral detail */}
              <circle cx="-5" cy="-3" r="2" fill="#FEF08A" />
              <circle cx="5" cy="-3" r="2" fill="#FEF08A" />
              <path d="M-4,4 Q0,8 4,4" stroke="#FEF08A" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          </g>
        );

      case 'lavender':
        return (
          <g className={withered ? '' : 'animate-sway'} style={{ transform: droop, filter: wilt }}>
            {/* Multiple Spire Stems */}
            <path d="M90,145 Q80,95 82,45" stroke="#4D7C0F" strokeWidth="4" fill="none" />
            <path d="M100,145 Q100,90 100,35" stroke="#4D7C0F" strokeWidth="5" fill="none" />
            <path d="M110,145 Q120,95 118,48" stroke="#4D7C0F" strokeWidth="4" fill="none" />
            {/* Lavender Floral Clusters */}
            {[
              { x: 82, y: 45, count: 6 },
              { x: 100, y: 35, count: 8 },
              { x: 118, y: 48, count: 6 },
            ].map((spire, sIdx) => (
              <g key={sIdx} transform={`translate(${spire.x}, ${spire.y})`}>
                {Array.from({ length: spire.count }).map((_, i) => (
                  <g key={i} transform={`translate(0, ${i * 7})`}>
                    <ellipse cx="-5" cy="0" rx="6" ry="4" fill="#8B5CF6" stroke="#5B21B6" strokeWidth="1.5" transform="rotate(-15)" />
                    <ellipse cx="5" cy="0" rx="6" ry="4" fill="#A78BFA" stroke="#5B21B6" strokeWidth="1.5" transform="rotate(15)" />
                    <ellipse cx="0" cy="-2" rx="4" ry="4" fill="#C4B5FD" />
                  </g>
                ))}
              </g>
            ))}
          </g>
        );

      case 'monstera':
        return (
          <g className={withered ? '' : 'animate-sway-slow'} style={{ transform: droop, filter: wilt }}>
            {/* Curved Thick Stems */}
            <path d="M100,145 Q80,105 70,65" stroke="#2D5A27" strokeWidth="5" fill="none" />
            <path d="M100,145 Q115,100 130,60" stroke="#2D5A27" strokeWidth="5" fill="none" />
            <path d="M100,145 Q98,85 100,45" stroke="#2D5A27" strokeWidth="6" fill="none" />
            {/* Large Split Leaf Left */}
            <path
              d="M70,65 C40,40 30,70 45,95 C55,105 70,95 70,65"
              fill="#15803D"
              stroke="#14532D"
              strokeWidth="2.5"
            />
            {/* Fenestration Cuts */}
            <path d="M52,70 Q60,73 54,77" stroke="#E2F5E0" strokeWidth="2.5" fill="none" />
            <path d="M48,82 Q56,84 50,88" stroke="#E2F5E0" strokeWidth="2.5" fill="none" />

            {/* Giant Top Heart Leaf */}
            <path
              d="M100,45 C70,10 50,45 80,75 C95,90 105,90 120,75 C150,45 130,10 100,45"
              fill="#16A34A"
              stroke="#14532D"
              strokeWidth="3"
            />
            <path d="M85,38 Q95,45 88,52" stroke="#E2F5E0" strokeWidth="3" fill="none" />
            <path d="M115,38 Q105,45 112,52" stroke="#E2F5E0" strokeWidth="3" fill="none" />
            <path d="M78,55 Q90,60 82,67" stroke="#E2F5E0" strokeWidth="3" fill="none" />
            <path d="M122,55 Q110,60 118,67" stroke="#E2F5E0" strokeWidth="3" fill="none" />
          </g>
        );

      case 'succulent':
        return (
          <g className={withered ? '' : 'animate-float'} style={{ transform: droop, filter: wilt }}>
            {/* Rosette Leaf Layers */}
            <g transform="translate(100, 115)">
              {/* Outer Ring */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <path
                  key={`out-${i}`}
                  d="M0,0 Q-14,-28 0,-38 Q14,-28 0,0"
                  fill="#14B8A6"
                  stroke="#0F766E"
                  strokeWidth="2"
                  transform={`rotate(${deg})`}
                />
              ))}
              {/* Mid Ring */}
              {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg, i) => (
                <path
                  key={`mid-${i}`}
                  d="M0,0 Q-10,-20 0,-28 Q10,-20 0,0"
                  fill="#2DD4BF"
                  stroke="#0F766E"
                  strokeWidth="2"
                  transform={`rotate(${deg})`}
                />
              ))}
              {/* Center Heart Ring */}
              <circle cx="0" cy="0" r="10" fill="#99F6E4" stroke="#0F766E" strokeWidth="2" />
              <circle cx="0" cy="0" r="4" fill="#F472B6" />
            </g>
          </g>
        );

      case 'sakura_bonsai':
        return (
          <g className={withered ? '' : 'animate-sway'} style={{ transform: droop, filter: wilt }}>
            {/* Gnarled Bonsai Trunk */}
            <path
              d="M100,145 Q85,115 105,95 Q125,75 100,55"
              stroke="#543825"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            {/* Branches */}
            <path d="M100,95 Q70,80 60,65" stroke="#543825" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M110,75 Q135,65 145,50" stroke="#543825" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Cloud Puffs of Pink Blossoms */}
            {[
              { cx: 60, cy: 60, r: 18 },
              { cx: 100, cy: 45, r: 24 },
              { cx: 140, cy: 45, r: 18 },
              { cx: 85, cy: 35, r: 16 },
              { cx: 115, cy: 30, r: 16 },
            ].map((cloud, i) => (
              <g key={i}>
                <circle cx={cloud.cx} cy={cloud.cy} r={cloud.r} fill="#FBCFE8" stroke="#DB2777" strokeWidth="2" />
                <circle cx={cloud.cx - 4} cy={cloud.cy - 3} r={3} fill="#F472B6" />
                <circle cx={cloud.cx + 5} cy={cloud.cy + 3} r={2.5} fill="#F472B6" />
              </g>
            ))}
          </g>
        );

      case 'moon_orchid':
        return (
          <g className={withered ? '' : 'animate-sway'} style={{ transform: droop, filter: wilt }}>
            {/* Arching Slender Stem */}
            <path d="M100,145 Q90,85 130,45" stroke="#374151" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Sleek Leathery Base Leaves */}
            <path d="M96,140 C55,130 50,150 96,148" fill="#1F2937" stroke="#111827" strokeWidth="2.5" />
            <path d="M104,140 C145,130 150,150 104,148" fill="#1F2937" stroke="#111827" strokeWidth="2.5" />
            {/* Luminescent Orchid Blooms */}
            {[
              { x: 100, y: 80, scale: 0.8 },
              { x: 120, y: 55, scale: 1.0 },
              { x: 135, y: 40, scale: 0.9 },
            ].map((b, i) => (
              <g key={i} transform={`translate(${b.x}, ${b.y}) scale(${b.scale})`}>
                {/* 3 Upper Sepals */}
                <ellipse cx="0" cy="-14" rx="8" ry="12" fill="#E0E7FF" stroke="#6366F1" strokeWidth="1.5" />
                <ellipse cx="-12" cy="4" rx="7" ry="11" fill="#E0E7FF" stroke="#6366F1" strokeWidth="1.5" transform="rotate(-35)" />
                <ellipse cx="12" cy="4" rx="7" ry="11" fill="#E0E7FF" stroke="#6366F1" strokeWidth="1.5" transform="rotate(35)" />
                {/* 2 Broad Lateral Petals */}
                <ellipse cx="-14" cy="-6" rx="11" ry="10" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2" />
                <ellipse cx="14" cy="-6" rx="11" ry="10" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2" />
                {/* Lip / Column with golden glow */}
                <path d="M-6,0 Q0,12 6,0 Q0,4 -6,0" fill="#818CF8" stroke="#3730A3" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3" fill="#FDE047" />
              </g>
            ))}
          </g>
        );

      case 'strawberry':
        return (
          <g className={withered ? '' : 'animate-sway'} style={{ transform: droop, filter: wilt }}>
            {/* Bushy Stems */}
            <path d="M100,145 Q80,105 75,80" stroke="#3F6212" strokeWidth="4" fill="none" />
            <path d="M100,145 Q115,100 125,75" stroke="#3F6212" strokeWidth="4" fill="none" />
            {/* Serrated Leaves */}
            <ellipse cx="65" cy="75" rx="15" ry="11" fill="#65A30D" stroke="#365314" strokeWidth="2" transform="rotate(-20 65 75)" />
            <ellipse cx="135" cy="70" rx="15" ry="11" fill="#65A30D" stroke="#365314" strokeWidth="2" transform="rotate(20 135 70)" />
            <ellipse cx="100" cy="60" rx="16" ry="12" fill="#4D7C0F" stroke="#365314" strokeWidth="2" />
            {/* Strawberries hanging */}
            <g transform="translate(80, 105)">
              <path d="M0,0 C-10,0 -12,16 0,22 C12,16 10,0 0,0" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
              <path d="M-4,-2 L0,2 L4,-2" stroke="#65A30D" strokeWidth="2" fill="#65A30D" />
              <circle cx="-3" cy="8" r="1" fill="#FEF08A" />
              <circle cx="3" cy="11" r="1" fill="#FEF08A" />
              <circle cx="0" cy="15" r="1" fill="#FEF08A" />
            </g>
            <g transform="translate(120, 100)">
              <path d="M0,0 C-8,0 -10,14 0,18 C10,14 8,0 0,0" fill="#F87171" stroke="#991B1B" strokeWidth="1.8" />
              <circle cx="0" cy="8" r="1" fill="#FEF08A" />
            </g>
          </g>
        );

      case 'dragon_lily':
        return (
          <g className={withered ? '' : 'animate-sway'} style={{ transform: droop, filter: wilt }}>
            {/* Tall Elegant Stem */}
            <path d="M100,145 Q105,80 98,35" stroke="#166534" strokeWidth="6" fill="none" />
            {/* Arching Lanceolate Leaves */}
            <path d="M100,120 Q55,100 40,115" stroke="#15803D" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M100,95 Q145,80 160,95" stroke="#15803D" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Grand Aurora Dragon Blossom */}
            <g transform="translate(98, 35)">
              {[-60, -30, 0, 30, 60, 180].map((deg, i) => (
                <path
                  key={i}
                  d="M0,0 Q-10,-30 0,-48 Q10,-30 0,0"
                  fill="url(#dragonGradient)"
                  stroke="#9A3412"
                  strokeWidth="2"
                  transform={`rotate(${deg})`}
                />
              ))}
              <circle cx="0" cy="0" r="8" fill="#FDE047" stroke="#B45309" strokeWidth="2" />
            </g>
          </g>
        );

      case 'glowing_nightshade':
        return (
          <g className={withered ? '' : 'animate-sway'} style={{ transform: droop, filter: wilt }}>
            {/* Deep Indigo Stems */}
            <path d="M100,145 Q85,90 90,40" stroke="#1E1B4B" strokeWidth="5" fill="none" />
            {/* Mystical Bell Flowers */}
            {[
              { x: 75, y: 70, deg: -30 },
              { x: 105, y: 55, deg: 25 },
              { x: 88, y: 35, deg: 0 },
            ].map((bell, i) => (
              <g key={i} transform={`translate(${bell.x}, ${bell.y}) rotate(${bell.deg})`}>
                <path d="M-10,-5 Q-12,18 0,22 Q12,18 10,-5 Z" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2" />
                <path d="M-8,18 Q0,24 8,18" stroke="#93C5FD" strokeWidth="2" fill="none" />
                <circle cx="0" cy="20" r="3" fill="#FDE047" className="animate-pulse" />
              </g>
            ))}
          </g>
        );

      case 'golden_pothos':
        return (
          <g className={withered ? '' : 'animate-sway'} style={{ transform: droop, filter: wilt }}>
            <path d="M100,145 Q65,110 55,60" stroke="#3F6212" strokeWidth="4.5" fill="none" />
            <path d="M100,145 Q135,110 145,65" stroke="#3F6212" strokeWidth="4.5" fill="none" />
            <path d="M100,145 Q95,85 100,45" stroke="#4D7C0F" strokeWidth="5" fill="none" />
            {/* Trailing Heart Leaves with marble streaks */}
            {[
              { x: 55, y: 60, r: -25, scale: 0.9 },
              { x: 145, y: 65, r: 25, scale: 0.9 },
              { x: 75, y: 95, r: -40, scale: 0.8 },
              { x: 125, y: 95, r: 40, scale: 0.8 },
              { x: 100, y: 45, r: 0, scale: 1.1 },
            ].map((leaf, i) => (
              <g key={i} transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.r}) scale(${leaf.scale})`}>
                <path d="M0,0 C-18,-20 -22,-42 0,-50 C22,-42 18,-20 0,0" fill="#65A30D" stroke="#365314" strokeWidth="2.5" />
                <path d="M-5,-30 Q0,-20 6,-35" stroke="#FEF08A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M-8,-15 Q0,-8 5,-22" stroke="#FEF08A" strokeWidth="2" fill="none" strokeLinecap="round" />
              </g>
            ))}
          </g>
        );

      case 'star_jasmine':
        return (
          <g className={withered ? '' : 'animate-sway'} style={{ transform: droop, filter: wilt }}>
            {/* Clambering Vine */}
            <path d="M100,145 Q70,95 90,45" stroke="#1E3A18" strokeWidth="4" fill="none" />
            <path d="M100,145 Q130,95 110,40" stroke="#1E3A18" strokeWidth="4" fill="none" />
            {/* Jasmine Star Flowers */}
            {[
              { x: 80, y: 50 },
              { x: 115, y: 45 },
              { x: 95, y: 75 },
              { x: 125, y: 80 },
              { x: 70, y: 95 },
            ].map((star, sIdx) => (
              <g key={sIdx} transform={`translate(${star.x}, ${star.y})`}>
                {[0, 72, 144, 216, 288].map((deg, i) => (
                  <ellipse key={i} cx="0" cy="-9" rx="3.5" ry="7" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" transform={`rotate(${deg})`} />
                ))}
                <circle cx="0" cy="0" r="3" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
              </g>
            ))}
          </g>
        );

      case 'solar_lavender':
        return (
          <g className={withered ? '' : 'animate-sway'} style={{ transform: droop, filter: wilt }}>
            {/* Golden-Violet hybrid spikes */}
            <path d="M90,145 Q80,95 82,45" stroke="#65A30D" strokeWidth="4" fill="none" />
            <path d="M100,145 Q100,90 100,30" stroke="#65A30D" strokeWidth="5" fill="none" />
            <path d="M110,145 Q120,95 118,48" stroke="#65A30D" strokeWidth="4" fill="none" />
            {[
              { x: 82, y: 45, count: 6 },
              { x: 100, y: 30, count: 8 },
              { x: 118, y: 48, count: 6 },
            ].map((spire, sIdx) => (
              <g key={sIdx} transform={`translate(${spire.x}, ${spire.y})`}>
                {Array.from({ length: spire.count }).map((_, i) => (
                  <g key={i} transform={`translate(0, ${i * 7})`}>
                    <ellipse cx="-5" cy="0" rx="6" ry="4" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" transform="rotate(-15)" />
                    <ellipse cx="5" cy="0" rx="6" ry="4" fill="#A855F7" stroke="#6B21A8" strokeWidth="1.5" transform="rotate(15)" />
                    <circle cx="0" cy="-2" r="3" fill="#FDE047" className="animate-pulse" />
                  </g>
                ))}
              </g>
            ))}
            {/* Radiant Sun Crown */}
            <g transform="translate(100, 20)">
              <circle cx="0" cy="0" r="7" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((d, i) => (
                <line key={i} x1="0" y1="-9" x2="0" y2="-14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" transform={`rotate(${d})`} />
              ))}
            </g>
          </g>
        );

      case 'cosmic_monstera':
        return (
          <g className={withered ? '' : 'animate-sway-slow'} style={{ transform: droop, filter: wilt }}>
            {/* Celestial Indigo Stems */}
            <path d="M100,145 Q80,105 70,65" stroke="#1E1B4B" strokeWidth="5" fill="none" />
            <path d="M100,145 Q115,100 130,60" stroke="#1E1B4B" strokeWidth="5" fill="none" />
            <path d="M100,145 Q98,85 100,40" stroke="#1E1B4B" strokeWidth="6" fill="none" />
            {/* Starlight Constellation Leaves */}
            <path d="M70,65 C40,40 30,70 45,95 C55,105 70,95 70,65" fill="#312E81" stroke="#4338CA" strokeWidth="2.5" />
            <path d="M100,40 C70,5 50,40 80,70 C95,85 105,85 120,70 C150,40 130,5 100,40" fill="#3730A3" stroke="#6366F1" strokeWidth="3" />
            {/* Glowing Constellation Dots and Lines */}
            <circle cx="85" cy="35" r="2.5" fill="#A5B4FC" className="animate-ping" />
            <circle cx="115" cy="35" r="2.5" fill="#A5B4FC" />
            <circle cx="100" cy="55" r="3" fill="#FDE047" />
            <line x1="85" y1="35" x2="100" y2="55" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="115" y1="35" x2="100" y2="55" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="2 2" />
          </g>
        );

      case 'sakura_jasmine':
        return (
          <g className={withered ? '' : 'animate-sway'} style={{ transform: droop, filter: wilt }}>
            {/* Graceful hybrid bonsai trunk with ivory/pink sprays */}
            <path d="M100,145 Q85,115 105,95 Q125,75 100,50" stroke="#4A2E18" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M100,95 Q70,80 55,65" stroke="#4A2E18" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M110,75 Q135,65 145,50" stroke="#4A2E18" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Pink & Ivory Mixed Blossoms */}
            {[
              { cx: 55, cy: 60, r: 16, c: '#FBCFE8' },
              { cx: 100, cy: 45, r: 22, c: '#FFF1F2' },
              { cx: 145, cy: 45, r: 17, c: '#FCE7F3' },
              { cx: 85, cy: 30, r: 15, c: '#F472B6' },
            ].map((cloud, i) => (
              <g key={i}>
                <circle cx={cloud.cx} cy={cloud.cy} r={cloud.r} fill={cloud.c} stroke="#DB2777" strokeWidth="1.5" />
                <circle cx={cloud.cx} cy={cloud.cy} r={4} fill="#FDE047" />
              </g>
            ))}
          </g>
        );

      case 'inferno_nightshade':
        return (
          <g className={withered ? '' : 'animate-sway'} style={{ transform: droop, filter: wilt }}>
            {/* Molten Stem */}
            <path d="M100,145 Q85,90 92,35" stroke="#7F1D1D" strokeWidth="6" fill="none" />
            {/* Fiery Bell Blooms */}
            {[
              { x: 75, y: 65, deg: -25 },
              { x: 110, y: 50, deg: 30 },
              { x: 92, y: 30, deg: 0 },
            ].map((bell, i) => (
              <g key={i} transform={`translate(${bell.x}, ${bell.y}) rotate(${bell.deg})`}>
                <path d="M-12,-6 Q-14,20 0,26 Q14,20 12,-6 Z" fill="url(#infernoGradient)" stroke="#991B1B" strokeWidth="2" />
                <circle cx="0" cy="24" r="4" fill="#FEF08A" className="animate-ping" />
              </g>
            ))}
          </g>
        );

      case 'ruby_pearl_succulent':
        return (
          <g className={withered ? '' : 'animate-float'} style={{ transform: droop, filter: wilt }}>
            {/* Jewel crystal rosette */}
            <g transform="translate(100, 115)">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <path
                  key={`out-${i}`}
                  d="M0,0 Q-12,-26 0,-36 Q12,-26 0,0"
                  fill="#FB7185"
                  stroke="#BE123C"
                  strokeWidth="2"
                  transform={`rotate(${deg})`}
                />
              ))}
              {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg, i) => (
                <path
                  key={`mid-${i}`}
                  d="M0,0 Q-8,-18 0,-26 Q8,-18 0,0"
                  fill="#FDA4AF"
                  stroke="#BE123C"
                  strokeWidth="2"
                  transform={`rotate(${deg})`}
                />
              ))}
              <circle cx="0" cy="0" r="10" fill="#FFE4E6" stroke="#E11D48" strokeWidth="2" />
              <circle cx="0" cy="0" r="4" fill="#EF4444" className="animate-pulse" />
            </g>
          </g>
        );

      case 'phoenix_bonsai':
        return (
          <g className={withered ? '' : 'animate-sway'} style={{ transform: droop, filter: wilt }}>
            {/* Mythic Fire Tree */}
            <path d="M100,145 Q80,115 105,90 Q130,65 100,45" stroke="#7C2D12" strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M100,90 Q65,75 55,55" stroke="#9A3412" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M110,70 Q140,55 150,40" stroke="#9A3412" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Everflame Blossom Flame Clouds */}
            {[
              { cx: 55, cy: 50, r: 18 },
              { cx: 100, cy: 35, r: 24 },
              { cx: 150, cy: 35, r: 18 },
            ].map((cloud, i) => (
              <g key={i}>
                <circle cx={cloud.cx} cy={cloud.cy} r={cloud.r} fill="#FDBA74" stroke="#EA580C" strokeWidth="2" />
                <circle cx={cloud.cx} cy={cloud.cy} r={cloud.r * 0.6} fill="#FDE047" />
                <polygon points={`${cloud.cx},${cloud.cy - cloud.r - 8} ${cloud.cx - 5},${cloud.cy - cloud.r + 2} ${cloud.cx + 5},${cloud.cy - cloud.r + 2}`} fill="#EF4444" />
              </g>
            ))}
          </g>
        );

      case 'chamomile':
      default:
        return (
          <g className={withered ? '' : 'animate-sway'} style={{ transform: droop, filter: wilt }}>
            {/* Feathery Foliage & Stems */}
            <path d="M100,145 Q90,95 85,55" stroke="#4D7C0F" strokeWidth="3.5" fill="none" />
            <path d="M100,145 Q110,95 115,50" stroke="#4D7C0F" strokeWidth="3.5" fill="none" />
            <path d="M100,145 Q100,85 100,38" stroke="#4D7C0F" strokeWidth="4" fill="none" />
            {/* Daisies */}
            {[
              { x: 85, y: 55, r: 8 },
              { x: 100, y: 38, r: 10 },
              { x: 115, y: 50, r: 8 },
            ].map((flower, idx) => (
              <g key={idx} transform={`translate(${flower.x}, ${flower.y})`}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, pIdx) => (
                  <ellipse
                    key={pIdx}
                    cx="0"
                    cy={-flower.r * 1.5}
                    rx="4"
                    ry="7"
                    fill="#FFFFFF"
                    stroke="#E2E8F0"
                    strokeWidth="1.2"
                    transform={`rotate(${deg})`}
                  />
                ))}
                <circle cx="0" cy="0" r={flower.r * 0.75} fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
              </g>
            ))}
          </g>
        );
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-end pointer-events-none">
      <svg
        viewBox="0 0 200 170"
        className="w-full h-full overflow-visible transition-transform duration-300"
        style={{
          filter: isHovered ? 'drop-shadow(0 4px 12px rgba(132, 204, 22, 0.25))' : 'none',
        }}
      >
        <defs>
          <linearGradient id="dragonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="50%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id="infernoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#581C87" />
          </linearGradient>
        </defs>

        {/* Weed sprouts on soil base if any */}
        {weedsCount > 0 && (
          <g transform="translate(0, 0)">
            <path d="M45,148 Q40,135 32,132" stroke="#84CC16" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M45,148 Q48,138 55,134" stroke="#65A30D" strokeWidth="3" fill="none" strokeLinecap="round" />
            {weedsCount > 1 && (
              <path d="M155,148 Q162,136 170,135" stroke="#84CC16" strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
          </g>
        )}

        {/* Main Plant Artwork */}
        {renderPlantArt()}

        {/* Golden Fertilizer Sparkles */}
        {isWellNourished && (
          <g className="animate-pulse">
            <polygon points="100,15 103,23 111,26 103,29 100,37 97,29 89,26 97,23" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
            <polygon points="65,45 67,50 72,52 67,54 65,59 63,54 58,52 63,50" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
            <polygon points="140,55 142,60 147,62 142,64 140,69 138,64 133,62 138,60" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
          </g>
        )}

        {/* Floating Pollen / Mature Sparkles */}
        {isMature && (
          <g className="pointer-events-none">
            <circle cx="90" cy="30" r="2.5" fill="#FEF08A" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="120" cy="20" r="2" fill="#FEF08A" className="animate-ping" style={{ animationDuration: '2.5s' }} />
          </g>
        )}
      </svg>
    </div>
  );
};
