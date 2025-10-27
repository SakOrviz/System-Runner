import React from 'react';
import { Position } from '../types';
import { PLAYER_WIDTH, PLAYER_HEIGHT } from '../constants';

interface PlayerProps {
  position: Position;
  direction: 'left' | 'right';
  isShielded: boolean;
  level: number;
}

const DivingHelmet: React.FC = () => (
  <g>
    <circle cx="25" cy="20" r="18" fill="#A5B4FC" stroke="#4338CA" strokeWidth="2"/>
    <circle cx="25" cy="20" r="12" fill="#E0E7FF"/>
    <rect x="24" y="2" width="2" height="4" fill="#4338CA"/>
  </g>
);

const BlueCap: React.FC = () => (
    <g transform="translate(0, -2)">
        <path d="M12 12 C 12 5, 38 5, 38 12 L 50 12 L 45 15 L 12 15 Z" fill="#3B82F6"/>
        <path d="M12 12 C 12 5, 38 5, 38 12" stroke="#1E40AF" strokeWidth="1.5" fill="none"/>
    </g>
);


const SpaceHelmet: React.FC = () => (
    <g>
        <circle cx="25" cy="25" r="22" fill="#F9FAFB" stroke="#9CA3AF" strokeWidth="2" />
        <rect x="15" y="15" width="20" height="15" fill="#111827" rx="5"/>
        <path d="M18 22 C 22 18, 28 18, 32 22" stroke="#4ADE80" strokeWidth="1.5" fill="none"/>
    </g>
);


const Player: React.FC<PlayerProps> = ({ position, direction, isShielded, level }) => {
  const showSpaceHelmet = level === 11 || level === 12;
  const showDivingHelmet = level === 7 || level === 8;
  const showCap = level === 9;

  return (
    <div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${PLAYER_WIDTH}px`,
        height: `${PLAYER_HEIGHT}px`,
        transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
        filter: 'drop-shadow(3px 5px 2px rgba(0,0,0,0.3))',
      }}
      className="absolute transition-transform duration-100"
    >
      <svg viewBox="0 0 50 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
        {isShielded && (
          <ellipse cx="25" cy="40" rx="30" ry="45" fill="rgba(59, 130, 246, 0.4)" stroke="#60A5FA" strokeWidth="2">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
        )}
        
        {/* Screwdriver */}
        <rect x="38" y="35" width="12" height="5" fill="#FBBF24"/>
        <rect x="42" y="25" width="4" height="10" fill="#9CA3AF"/>
        
        {/* Head and Accessories */}
        {!showSpaceHelmet && (
            <>
                {/* Head */}
                <rect x="15" y="10" width="20" height="20" fill="#FDE68A"/>
                {/* Hair */}
                {!showDivingHelmet && <path d="M15 10 C15 5, 35 5, 35 10 Z" fill="#78350F"/>}
                {/* Eyes */}
                <circle cx="21" cy="20" r="2" fill="black"/>
                <circle cx="29" cy="20" r="2" fill="black"/>
            </>
        )}
        
        {/* Body (Blue Jumpsuit) */}
        <rect x="10" y="30" width="30" height="35" fill="#3B82F6"/>
        
        {/* Arms */}
        <rect x="5" y="30" width="5" height="20" fill="#3B82F6"/>
        <rect x="40" y="30" width="5" height="20" fill="#3B82F6"/>
        
        {/* Hands */}
        <rect x="3" y="50" width="8" height="8" fill="#FDE68A"/>
        <rect x="39" y="50" width="8" height="8" fill="#FDE68A"/>

        {/* Legs */}
        <rect x="12" y="65" width="10" height="15" fill="#3B82F6"/>
        <rect x="28" y="65" width="10" height="15" fill="#3B82F6"/>
        
        {/* Feet/Boots */}
        <rect x="10" y="75" width="12" height="5" fill="#4B5563"/>
        <rect x="28" y="75" width="12" height="5" fill="#4B5563"/>

        {/* RENDER ACCESSORIES ON TOP */}
        {showDivingHelmet && <DivingHelmet />}
        {showCap && <BlueCap />}
        {showSpaceHelmet && <SpaceHelmet />}

      </svg>
    </div>
  );
};

export default Player;
