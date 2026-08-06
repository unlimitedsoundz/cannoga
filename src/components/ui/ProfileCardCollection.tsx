'use client';

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
  const gridCols = tilesPerRow === 2 ? 'lg:grid-cols-2' : tilesPerRow === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-8`}>
      {tiles.map((tile, index) => (
        <div key={index} className="bg-card border border-neutral-200 flex flex-col p-6">
          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-bold mb-2 text-black">{tile.name}</h3>
            <p className="text-sm font-medium text-neutral-700 mb-3">{tile.workTitle}</p>
            <p className="text-xs text-neutral-500 mb-2">{tile.unit}</p>
            {tile.badge && (
              <div className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium mb-4">
                <div className="font-bold">{tile.badge.label}</div>
                <div className="text-[10px]">{tile.badge.body}</div>
              </div>
            )}
            <p className="text-sm text-neutral-700 leading-relaxed mb-4 flex-1">
              {tile.description}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">Email</span>
                <span className="text-xs text-black font-medium">{tile.email}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
