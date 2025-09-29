import type { IndexFeature, StatusRecord } from './types';
import { Card } from './Card';

export function Column({
  status,
  features,
}: {
  status: StatusRecord;
  features: IndexFeature[];
}) {
  return (
    <div className="flex-1 min-w-[260px] max-w-[380px] bg-gray-50 dark:bg-widget-bg-dark rounded-lg border-1 border-gray-200 dark:border-gray-800">
      <div className="px-3 py-2 border-b-1 border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-700 dark:text-white">
          {status.name}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-300">{features.length}</div>
      </div>
      <div className="p-3 space-y-3">
        {features.map((f) => (
          <Card key={f.id} feature={f} />
        ))}
      </div>
    </div>
  );
}
