import type { ShowFeature } from './types';
import { sanitizeHtml } from '../../lib/sanitize';

export function BoardModal({ feature, onClose }: { feature: ShowFeature; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-widget-input-dark text-slate-800 dark:text-white w-full max-w-2xl max-h-[85vh] rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-base font-semibold line-clamp-2">{feature.title}</h2>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-md text-sm bg-widget-input-light dark:bg-widget-bg-dark hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
        <div className="p-4 overflow-y-auto space-y-4">
          {feature.image ? (
            <img src={feature.image} alt="feature" className="w-full max-h-64 object-cover rounded" />
          ) : null}

          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(feature.description) }}
          />

          <div className="text-xs text-slate-600 dark:text-slate-300 flex gap-4">
            <span>Status: {feature.status}</span>
            <span>Votes: {feature.public_upvotes_count + feature.private_upvotes_count}</span>
            <span>Comments: {feature.comments_count}</span>
          </div>

          {feature.comments?.length ? (
            <div>
              <div className="text-sm font-semibold mb-2">Comments</div>
              <div className="space-y-3">
                {feature.comments.map((c) => (
                  <div key={c.id} className="text-sm border border-gray-200 dark:border-gray-800 rounded p-2">
                    <div className="text-xs text-slate-500 dark:text-slate-300 mb-1">
                      {c.contributor?.name || c.contributor?.email || 'Anonymous'} · {new Date(c.inserted_at).toLocaleString()}
                    </div>
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.message) }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="text-right text-xs">
            <a href={feature.url} target="_blank" rel="noreferrer" className="underline">Open in Upvoted</a>
          </div>
        </div>
      </div>
    </div>
  );
}
