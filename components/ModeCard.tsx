import React from 'react';
import { ModeConfig, OptimizationMode } from '../types';
import { Icon } from './Icon';

interface ModeCardProps {
  config: ModeConfig;
  isSelected: boolean;
  onClick: (mode: OptimizationMode) => void;
}

export const ModeCard: React.FC<ModeCardProps> = ({ config, isSelected, onClick }) => {
  return (
    <button
      onClick={() => onClick(config.id)}
      className={`
        group relative flex flex-col items-start justify-between p-4 border-2 transition-all duration-150 h-full w-full text-left
        ${isSelected 
          ? 'bg-zinc-100 border-zinc-100 text-black' 
          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-orange-500 hover:text-orange-500'
        }
      `}
    >
      {/* Corner accents for industrial feel */}
      <div className={`absolute top-0 right-0 w-2 h-2 ${isSelected ? 'bg-black' : 'bg-transparent group-hover:bg-orange-500'}`} />
      <div className={`absolute bottom-0 left-0 w-2 h-2 ${isSelected ? 'bg-black' : 'bg-transparent group-hover:bg-orange-500'}`} />

      <div className="flex items-center justify-between w-full mb-3">
        <Icon name={config.icon} size={24} className={isSelected ? 'stroke-2' : 'stroke-1'} />
        <span className="font-mono text-xs opacity-50">MODEL_OPT_{config.id.substring(0,3)}</span>
      </div>
      
      <div>
        <h3 className={`font-bold text-lg mb-1 tracking-tight ${isSelected ? 'text-black' : 'text-zinc-100'}`}>
          {config.label}
        </h3>
        <p className={`text-xs leading-relaxed font-mono ${isSelected ? 'text-zinc-800' : 'text-zinc-500'}`}>
          {config.description}
        </p>
      </div>
    </button>
  );
};