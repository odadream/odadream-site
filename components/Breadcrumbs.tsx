import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { LotusNode } from '../types';

interface BreadcrumbsProps {
  path: LotusNode[];
  onNavigateToLevel: (index: number) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path, onNavigateToLevel }) => {
  return (
    <nav className="h-12 w-full border-b border-border bg-canvas flex items-center px-4 md:px-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="flex items-center text-xs md:text-sm font-mono uppercase tracking-wide">
        {path.map((node, index) => {
          const isLast = index === path.length - 1;
          return (
            <React.Fragment key={node.id}>
              <button
                onClick={() => onNavigateToLevel(index)}
                className={`
                  flex items-center transition-colors hover:text-accent-text
                  ${isLast ? 'text-white font-bold' : 'text-txt-dim'}
                `}
              >
                {index === 0 ? (
                  <>
                   <Home className="w-3 h-3 mr-2" />
                   HOME
                  </>
                ) : (
                  node.shortTitle || node.title
                )}
              </button>
              
              {!isLast && (
                <ChevronRight className="w-3 h-3 text-txt-dim mx-2" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};