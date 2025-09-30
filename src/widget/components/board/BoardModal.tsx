import type { ShowFeature } from './types';
import { sanitizeHtml } from '../../lib/sanitize';

export function BoardModal({ feature, onClose }: { feature: ShowFeature; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-widget-input-dark text-slate-800 dark:text-white w-full max-w-2xl max-h-[85vh] rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900/60">
          <h2 className="text-base font-semibold line-clamp-2">{feature.title}</h2>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-md text-sm bg-widget-input-light dark:bg-widget-bg-dark hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
        <div className="p-4 overflow-y-auto space-y-6">
          {feature.image ? (
            <div className="bg-white rounded overflow-hidden">
              <img src={feature.image} alt="feature" className="w-full max-h-64 object-cover object-top" />
            </div>
          ) : null}

          <section className="space-y-3">
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Description</div>
            <div
              className="prose prose-sm dark:prose-invert max-w-none border border-gray-200 dark:border-gray-800 rounded-md p-3 bg-white dark:bg-transparent"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(feature.description) }}
            />
          </section>

          <section className="border border-gray-200 dark:border-gray-800 rounded-md p-3 bg-gray-50/60 dark:bg-gray-900/30">
            <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap gap-4 items-center">
              <span>Status: {feature.status}</span>
              <span className="inline-flex items-center gap-1">
                Votes:
                <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                  Public {feature.public_upvotes_count}
                </span>
                <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Private {feature.private_upvotes_count}
                </span>
                <span className="opacity-70">(Total {feature.public_upvotes_count + feature.private_upvotes_count})</span>
              </span>
              <span>Comments: {feature.comments_count}</span>
            </div>
          </section>

          {feature.comments?.length ? (
            <section className="space-y-3">
              <div className="text-sm font-semibold">Comments</div>
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
            </section>
          ) : null}

          {feature.public_url ? (
            <div className="text-right text-xs">
              <a href={feature.public_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded border border-primary-300 text-primary-700 hover:bg-primary-50 dark:border-amber-400/40 dark:text-amber-300 dark:hover:bg-amber-400/10">
                Open in Upvoted
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
