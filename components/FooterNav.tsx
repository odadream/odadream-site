import React from 'react';
import { QUICK_ACCESS } from '../constants';
import { LotusNode } from '../types';
import { THEME } from '../styles/theme';

interface FooterNavProps {
  onNavigate: (node: LotusNode) => void;
  currentId: string;
}

export const FooterNav: React.FC<FooterNavProps> = ({ onNavigate, currentId }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="h-14 w-full border-t border-white/5 bg-canvas flex items-center px-4 justify-between">
      {/* Navigation Links (Scrollable) */}
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide flex-1 mr-4">
        {QUICK_ACCESS.map((node) => {
           const isActive = currentId === node.id;
           return (
             <button
                key={node.id}
                onClick={() => onNavigate(node)}
                className={`
                  ${THEME.interactive.navButton}
                  ${isActive 
                    ? THEME.interactive.navButtonActive 
                    : THEME.interactive.navButtonInactive}
                  whitespace-nowrap
                `}
             >
                {node.shortTitle || node.title}
             </button>
           );
        })}
      </div>

      {/* Copyright Label (Fixed) */}
      <div className="shrink-0 text-[10px] text-white/20 font-mono select-none tracking-widest hidden md:block">
        © ODA.DREAM {currentYear}
      </div>
    </footer>
  );
};