import type { IndexFeature, StatusRecord } from './types';
import { Card } from './Card';

export function Column({
  status,
  features,
  hasMore,
  onLoadMore,
  descriptionsById,
  onCardClick,
}: {
  status: StatusRecord;
  features: IndexFeature[];
  hasMore: boolean;
  onLoadMore: () => void | Promise<void>;
  descriptionsById: Record<string, string | undefined>;
  onCardClick: (feature: IndexFeature) => void;
}) {
  return (
    <div className="flex flex-col h-full flex-1 min-w-[260px] max-w-[380px] bg-gray-50 dark:bg-widget-bg-dark rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
        <div className="text-sm font-semibold text-slate-700 dark:text-white">
          {status.name}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-300">{features.length}</div>
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
            Load more
          </button>
        )}
      </div>
    </div>
  );
}
