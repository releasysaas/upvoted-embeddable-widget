import { useState } from 'react';
import { sanitizeHtml } from '../../lib/sanitize';
import { createComment, upvoteFeature } from './api';
import type { ShowFeature } from './types';

export function BoardModal({ feature, onClose, allowFeatureComment = false, allowFeatureUpvote = false, authToken }: { feature: ShowFeature; onClose: () => void; allowFeatureComment?: boolean; allowFeatureUpvote?: boolean; authToken?: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitOk, setSubmitOk] = useState(false);
  const [upvoting, setUpvoting] = useState(false);
  const [didUpvote, setDidUpvote] = useState(false);
  const [publicVotes, setPublicVotes] = useState(feature.public_upvotes_count);
  const [privateVotes] = useState(feature.private_upvotes_count);
  const [activeTab, setActiveTab] = useState<'upvote' | 'comment'>(() => {
    if (allowFeatureUpvote) return 'upvote';
    return 'comment';
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authToken) {
      setSubmitError('Missing auth token');
      return;
    }
    if (!name.trim() || !email.trim() || !message.trim()) {
      setSubmitError('Name, email, and comment are required');
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      await createComment(authToken, feature.id, {
        message: message.trim(),
        contributor: { name: name.trim(), email: email.trim() },
      });
      setSubmitOk(true);
      setMessage('');
      setName('');
      setEmail('');
    } catch {
      setSubmitError('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  }
  async function handleUpvote() {
    if (!allowFeatureUpvote) return;
    if (!authToken) return;
    if (didUpvote) return;
    if (!name.trim() || !email.trim()) {
      setSubmitError('Name and email are required to upvote');
      return;
    }
    setUpvoting(true);
    try {
      await upvoteFeature(authToken, feature.id, { contributor: { name: name.trim(), email: email.trim() } });
      setPublicVotes((v) => v + 1);
      setDidUpvote(true);
      setName('');
      setEmail('');
    } catch {
      // swallow; optionally show a toast in the future
    } finally {
      setUpvoting(false);
    }
  }
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
              {feature.contributor ? (
                <span>
                  Contributor: {feature.contributor.name}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2 flex-wrap">
                Votes:
                <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                  Public {publicVotes}
                </span>
                <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Private {privateVotes}
                </span>
                <span className="opacity-70">(Total {publicVotes + privateVotes})</span>
              </span>
              <span>Comments: {feature.comments_count}</span>
            </div>
          </section>

          {(allowFeatureComment || allowFeatureUpvote) && (
            <section className="border border-gray-200 dark:border-gray-800 rounded-md">
              <div className="flex border-b border-gray-200 dark:border-gray-800">
                {allowFeatureUpvote && (
                  <button
                    type="button"
                    onClick={() => { setActiveTab('upvote'); setSubmitError(null); }}
                    className={`px-3 py-2 text-sm ${activeTab === 'upvote' ? 'border-b-2 border-primary-500 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    Upvote
                  </button>
                )}
                {allowFeatureComment && (
                  <button
                    type="button"
                    onClick={() => { setActiveTab('comment'); setSubmitError(null); }}
                    className={`px-3 py-2 text-sm ${activeTab === 'comment' ? 'border-b-2 border-primary-500 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    Comment
                  </button>
                )}
              </div>

              {/* Upvote tab content */}
              {allowFeatureUpvote && activeTab === 'upvote' && (
                <div className="p-3 bg-white dark:bg-transparent space-y-2">
                  <div className="text-sm font-semibold">Your info</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Name"
                      className="flex-1 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-widget-bg-dark px-2 py-1 text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="flex-1 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-widget-bg-dark px-2 py-1 text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {submitError && <div className="text-xs text-danger-600 dark:text-red-300">{submitError}</div>}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={handleUpvote}
                      disabled={didUpvote || upvoting}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-primary-300 text-primary-700 hover:bg-primary-50 disabled:opacity-60 disabled:cursor-not-allowed dark:border-amber-400/40 dark:text-amber-300 dark:hover:bg-amber-400/10"
                    >
                      {didUpvote ? 'Upvoted' : upvoting ? 'Upvoting…' : 'Upvote'}
                    </button>
                  </div>
                </div>
              )}

              {/* Comment tab content */}
              {allowFeatureComment && activeTab === 'comment' && (
                <div className="p-3 bg-white dark:bg-transparent">
                  <div className="text-sm font-semibold mb-2">Add a comment</div>
                  <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Name"
                        className="flex-1 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-widget-bg-dark px-2 py-1 text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="flex-1 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-widget-bg-dark px-2 py-1 text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <textarea
                      placeholder="Your comment"
                      className="w-full min-h-20 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-widget-bg-dark px-2 py-1 text-sm"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-danger-600 dark:text-red-300">{submitError}</div>
                      {submitOk && <div className="text-xs text-emerald-600 dark:text-emerald-300">Comment submitted</div>}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-primary-300 text-primary-700 hover:bg-primary-50 disabled:opacity-60 disabled:cursor-not-allowed dark:border-amber-400/40 dark:text-amber-300 dark:hover:bg-amber-400/10"
                      >
                        {submitting ? 'Submitting…' : 'Submit comment'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </section>
          )}

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
              <a href={feature.public_url} target="_blank" rel="noreferrer" className="underline">
                Open in Upvoted
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
