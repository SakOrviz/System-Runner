
import React from 'react';
import { Enemy } from '../types';

interface EnemyProps {
  enemy: Enemy;
}

const PcSvg: React.FC = () => (
  <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pcCaseGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E5E7EB" />
        <stop offset="100%" stopColor="#D1D5DB" />
      </linearGradient>
      <linearGradient id="screenGradient" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#1F2937" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
    </defs>
    <rect width="70" height="70" rx="5" fill="url(#pcCaseGradient)" stroke="#9CA3AF" strokeWidth="1"/>
    
    <rect x="5" y="5" width="60" height="40" rx="3" fill="url(#screenGradient)" stroke="#4B5563" strokeWidth="2"/>
    <rect x="10" y="10" width="50" height="30" fill="#000"/>
    <path d="M 12 12 Q 35 15, 58 12 L 58 18 Q 35 21, 12 18 Z" fill="white" fillOpacity="0.1"/>
    
    {/* Animated Scanline */}
    <rect x="10" y="10" width="50" height="2" fill="#4ADE80" fillOpacity="0.3">
        <animate attributeName="y" from="10" to="38" dur="2.5s" repeatCount="indefinite" />
    </rect>

    <rect x="15" y="50" width="40" height="5" fill="#374151" stroke="#1F2937" strokeWidth="1"/>
    
    <rect x="15" y="60" width="15" height="5" fill="#4B5563"/>
    <circle cx="60" cy="62.5" r="3.5" fill="#4ADE80" stroke="#166534" strokeWidth="1">
      <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);

const HddSvg: React.FC = () => (
  <svg viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-hidden">
    <defs>
      <linearGradient id="hddCaseGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F3F4F6" />
        <stop offset="100%" stopColor="#D1D5DB" />
      </linearGradient>
      <radialGradient id="platterGradient">
        <stop offset="60%" stopColor="#E5E7EB"/>
        <stop offset="95%" stopColor="#B0B5BB"/>
        <stop offset="100%" stopColor="#9CA3AF"/>
      </radialGradient>
    </defs>
    <rect width="50" height="30" rx="3" fill="url(#hddCaseGradient)" stroke="#9CA3AF" strokeWidth="1"/>
    
    <g transform="translate(25, 15)">
       <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="1s" repeatCount="indefinite" />
      <circle r="12" fill="url(#platterGradient)"/>
      <path d="M -8 -8 A 12 12 0 0 1 8 -8 L 0 0 Z" fill="white" fillOpacity="0.5"/>
    </g>

    <circle cx="25" cy="15" r="3" fill="#4B5563" stroke="#1F2937" strokeWidth="1"/>
    
    {/* Animated Read/Write Head */}
    <g>
      <animateTransform attributeName="transform" type="rotate" from="-5 5 5" to="5 5 5" dur="0.75s" repeatCount="indefinite" values="-5 5 5; 5 5 5; -5 5 5" keyTimes="0; 0.5; 1" />
      <path d="M 5 5 L 20 13" stroke="#6B7280" strokeWidth="1.5"/>
      <rect x="19" y="12" width="4" height="2" fill="#374151"/>
    </g>
    
    <circle cx="3" cy="3" r="1" fill="#9CA3AF"/>
    <circle cx="47" cy="3" r="1" fill="#9CA3AF"/>
    <circle cx="3" cy="27" r="1" fill="#9CA3AF"/>
    <circle cx="47" cy="27" r="1" fill="#9CA3AF"/>
  </svg>
);

const RamSvg: React.FC = () => (
    <svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ramBoardGradient" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#16A34A" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
      <linearGradient id="ramChipGradient" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#374151" />
        <stop offset="100%" stopColor="#111827" />
      </linearGradient>
       <linearGradient id="goldContactShimmer" x1="-1" y1="0" x2="0" y2="0">
         <stop offset="0.4" stopColor="#FBBF24" stopOpacity="0.5" />
         <stop offset="0.5" stopColor="#FEF08A" stopOpacity="1" />
         <stop offset="0.6" stopColor="#FBBF24" stopOpacity="0.5" />
         <animate attributeName="x1" from="-1" to="2" dur="2s" repeatCount="indefinite" />
       </linearGradient>
    </defs>
    
    <rect width="80" height="20" fill="url(#ramBoardGradient)"/>
    
    <path d="M 4 18 L 4 14 L 8 10 M 14 18 L 14 14 L 18 10 M 24 18 L 24 14 L 28 10 M 76 18 L 76 14 L 72 10" stroke="#14532D" strokeWidth="0.5"/>
    
    {/* Animated RAM chips */}
    {[5, 18, 31, 44, 57, 70].map(x => (
       <rect key={x} x={x-1} y={4} width="10" height="12" rx="1" fill="url(#ramChipGradient)" stroke="#000" strokeWidth="0.5">
            <animate attributeName="opacity" values="1;0.7;1" dur={`${1.5 + Math.random()}s`} repeatCount="indefinite" begin={`${Math.random()}s`} />
       </rect>
    ))}

    <path d="M 0 20 L 38 20 L 40 16 L 42 20 L 80 20" stroke="#14532D" strokeWidth="1" fill="transparent"/>
    
    <g>
      {[...Array(20)].map((_, i) => (
        <rect key={i} x={i * 4} y="16" width="3" height="4" fill="#FBBF24" />
      ))}
      <rect x="0" y="16" width="80" height="4" fill="url(#goldContactShimmer)"/>
    </g>
  </svg>
);


const EnemyComponent: React.FC<EnemyProps> = ({ enemy }) => {
  const renderEnemy = () => {
    switch (enemy.type) {
      case 'PC':
        return <PcSvg />;
      case 'HDD':
        return <HddSvg />;
      case 'RAM':
        return <RamSvg />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        left: `${enemy.position.x}px`,
        top: `${enemy.position.y}px`,
        width: `${enemy.width}px`,
        height: `${enemy.height}px`,
        filter: 'drop-shadow(3px 5px 2px rgba(0,0,0,0.3))',
      }}
      className="absolute"
    >
      {renderEnemy()}
    </div>
  );
};

export default EnemyComponent;