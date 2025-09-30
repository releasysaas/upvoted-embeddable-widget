import type { IndexFeature, StatusRecord } from './types';
import { Card } from './Card';

export function Column({
  status,
  features,
  hasMore,
  onLoadMore,
  descriptionsById,
  onCardClick,
  remainingCount,
}: {
  status: StatusRecord;
  features: IndexFeature[];
  hasMore: boolean;
  onLoadMore: () => void | Promise<void>;
  descriptionsById: Record<string, string | undefined>;
  onCardClick: (feature: IndexFeature) => void;
  remainingCount: number;
}) {
  return (
    <div className="flex flex-col h-full flex-1 min-w-[260px] max-w-[380px] bg-gray-50 dark:bg-widget-bg-dark rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="font-bold text-lg mb-3 p-2 text-white bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-700 dark:to-gray-800 rounded-md shadow-sm border-l-4 border-primary-500 text-center flex-shrink-0">
        {status.name} <span className="font-normal text-xs opacity-80">({features.length})</span>
      </div>
      <div className="p-3 space-y-3 flex-1 overflow-y-auto min-h-0">
        {features.map((f) => (
          <Card
            key={f.id}
            feature={f}
            description={descriptionsById[f.id]}
            onClick={onCardClick}
          />
        ))}
        {hasMore && (
          <button
            onClick={onLoadMore}
            className="w-full text-sm bg-widget-input-light dark:bg-widget-input-dark text-slate-700 dark:text-white border border-gray-200 dark:border-gray-800 rounded-md py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Load more <span className="font-normal text-xs opacity-80">({remainingCount})</span>
          </button>
        )}
      </div>
    </div>
  );
}
