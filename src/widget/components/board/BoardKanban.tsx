import type { IndexFeature, StatusRecord } from './types';
import { Column } from './Column';

export function BoardKanban({
  statuses,
  featuresByStatus,
}: {
  statuses: StatusRecord[];
  featuresByStatus: Record<string, IndexFeature[]>;
}) {
  const sorted = [...statuses].sort((a, b) => a.order - b.order);
  return (
    <div className='w-full'>
      <div className='flex gap-4 overflow-x-auto pb-4'>
        {sorted.map((s) => (
          <Column
            key={s.name}
            status={s}
            features={featuresByStatus[s.name.toLowerCase()] || []}
          />)
        )}
      </div>
    </div>
  );
}
