import type { IndexFeature } from './types';

export function Card({
  feature,
  description,
  onClick,
}: {
  feature: IndexFeature;
  description?: string;
  onClick: (feature: IndexFeature) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(feature)}
      className="text-left w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-widget-input-dark p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-start gap-2">
        {feature.image ? (
          <img
            src={feature.image}
            alt="feature"
            className="w-12 h-12 rounded object-cover flex-shrink-0"
          />
        ) : null}
        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-800 dark:text-white line-clamp-2">
            {feature.title}
          </div>
          {description ? (
            <div className="mt-1 text-xs text-slate-600 dark:text-slate-300 overflow-hidden">
              {description}
            </div>
          ) : null}
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">
            {feature.public_upvotes_count + feature.private_upvotes_count} votes · {feature.comments_count} comments
          </div>
        </div>
      </div>
    </button>
  );
}
