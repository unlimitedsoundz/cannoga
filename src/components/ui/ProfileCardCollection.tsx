'use client';

import { Envelope } from '@phosphor-icons/react';

interface ProfileTile {
  name: string;
  workTitle: string;
  description: string;
  avatar: {
    image: string;
    tooltip: string;
  };
  badge?: {
    label: string;
    body: string;
  };
  unit: string;
  email: string;
  telephone?: string;
}

interface ProfileCardCollectionProps {
  tiles: ProfileTile[];
  tilesPerRow?: number;
}

export function ProfileCardCollection({
  tiles,
  tilesPerRow = 3
}: ProfileCardCollectionProps) {
  const gridCols = tilesPerRow === 2 
    ? 'lg:grid-cols-2' 
    : tilesPerRow === 4 
    ? 'lg:grid-cols-4' 
    : 'lg:grid-cols-3';

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-6`}>
      {tiles.map((tile, index) => {
        const formattedEmail = tile.email || `${tile.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@cannogacollege.ca`;
        
        return (
          <div key={index} className="bg-[#f8fafc] border border-neutral-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-black leading-snug mb-1">{tile.name}</h3>
                <p className="text-xs font-semibold text-neutral-600 mb-1">{tile.workTitle}</p>
                <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-3">{tile.unit}</p>
                
                {tile.badge && (
                  <div className="inline-block bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded text-[11px] font-medium mb-3">
                    <div className="font-bold">{tile.badge.label}</div>
                    <div className="text-[10px]">{tile.badge.body}</div>
                  </div>
                )}
                
                <p className="text-xs text-neutral-700 leading-relaxed line-clamp-3 mb-4">
                  {tile.description}
                </p>
              </div>
            </div>

            {/* Compact Footer band with #0a151a background and linked email */}
            <div className="bg-[#0a151a] text-white px-5 py-3 flex items-center justify-between border-t border-neutral-800 text-xs">
              <span className="text-[11px] text-white/60 uppercase tracking-widest font-mono">Email</span>
              <a
                href={`mailto:${formattedEmail}`}
                className="inline-flex items-center gap-1.5 text-white font-medium underline underline-offset-4 decoration-white/50 hover:decoration-white hover:text-white transition-all text-xs truncate max-w-[220px]"
                title={`Email ${tile.name}`}
              >
                <Envelope size={14} weight="bold" className="shrink-0 text-white/80" />
                <span className="truncate">{formattedEmail}</span>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
