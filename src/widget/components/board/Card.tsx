import type { IndexFeature } from './types';

export function Card({ feature }: { feature: IndexFeature }) {
  return (
    <a
      href={feature.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-md border-1 border-gray-200 dark:border-gray-800 bg-white dark:bg-widget-input-dark p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">
            {feature.public_upvotes_count + feature.private_upvotes_count} votes · {feature.comments_count} comments
          </div>
        </div>
      </div>
    </a>
  );
}
