import type { IndexFeature, StatusRecord } from './types';
import { Column } from './Column';

export function BoardKanban({
  statuses,
  featuresByStatus,
  hasMoreByStatus,
  onLoadMore,
  descriptionsById,
  onCardClick,
  remainingByStatus,
}: {
  statuses: StatusRecord[];
  featuresByStatus: Record<string, IndexFeature[]>;
  hasMoreByStatus: Record<string, boolean>;
  onLoadMore: (statusKey: string) => void | Promise<void>;
  descriptionsById: Record<string, string | undefined>;
  onCardClick: (feature: IndexFeature) => void;
  remainingByStatus: Record<string, number>;
}) {
  const sorted = [...statuses].sort((a, b) => a.order - b.order);
  return (
    <div className='w-full h-full'>
      <div className='flex gap-4 overflow-x-auto pb-4 h-full'>
        {sorted.map((s) => (
          <Column
            key={s.name}
            status={s}
            features={featuresByStatus[s.name.toLowerCase()] || []}
            hasMore={!!hasMoreByStatus[s.name.toLowerCase()]}
            onLoadMore={() => onLoadMore(s.name.toLowerCase())}
            descriptionsById={descriptionsById}
            onCardClick={onCardClick}
            remainingCount={remainingByStatus[s.name.toLowerCase()] ?? 0}
          />)
        )}
      </div>
    </div>
  );
}
