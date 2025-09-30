import { useEffect, useMemo, useState } from 'react';
import { stripHtml } from '../../lib/sanitize';
import { BoardKanban } from './BoardKanban';
import { BoardModal } from './BoardModal';
import { fetchFeatureDetail, fetchFeaturesByStatus, fetchStatuses } from './api';
import type { IndexFeature, ShowFeature, StatusRecord } from './types';

type Props = {
  authToken: string;
  className: string;
  statusesFilter?: string[]; // list of lowercased status names to include; if undefined -> include all
  allowFeatureComment?: boolean;
};

const PER_PAGE = 10;

export function BoardContainer({ authToken, className, statusesFilter, allowFeatureComment = false }: Props) {
  const [statuses, setStatuses] = useState<StatusRecord[] | null>(null);
  const [featuresByStatus, setFeaturesByStatus] = useState<Record<string, IndexFeature[]>>({});
  const [pagesByStatus, setPagesByStatus] = useState<Record<string, number>>({});
  const [totalsByStatus, setTotalsByStatus] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [descriptionsById, setDescriptionsById] = useState<Record<string, string>>({});
  const [detailCache, setDetailCache] = useState<Record<string, ShowFeature>>({});
  const [selected, setSelected] = useState<ShowFeature | null>(null);

  const sortedStatuses = useMemo(() => {
    return (statuses ?? []).slice().sort((a, b) => a.order - b.order);
  }, [statuses]);

  const statusesDep = useMemo(() => (statusesFilter && statusesFilter.length > 0 ? statusesFilter.join(',') : ''), [statusesFilter]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const statusesResp = await fetchStatuses(authToken);
        if (cancelled) return;
        // Filter by provided statuses (by lowercased name) if present
        const filtered = statusesFilter && statusesFilter.length > 0
          ? statusesResp.records.filter((s) => statusesFilter.includes(s.name.toLowerCase()))
          : statusesResp.records;
        setStatuses(filtered);

        const byStatus: Record<string, IndexFeature[]> = {};
        const pages: Record<string, number> = {};
        const totals: Record<string, number> = {};
        // Fetch features for each status in parallel (best effort)
        await Promise.all(
          filtered.map(async (s) => {
            const statusKey = s.name.toLowerCase();
            try {
              const featuresResp = await fetchFeaturesByStatus(authToken, statusKey, 1, PER_PAGE);
              byStatus[statusKey] = featuresResp.records;
              pages[statusKey] = 1;
              totals[statusKey] = featuresResp.total_count ?? featuresResp.records.length;
              // Prefetch descriptions for initial features in this status
              await prefetchDescriptions(featuresResp.records);
            } catch {
              // individual status failure shouldn't block others
              byStatus[statusKey] = [];
              pages[statusKey] = 0;
              totals[statusKey] = 0;
            }
          }),
        );
        if (cancelled) return;
        setFeaturesByStatus(byStatus);
        setPagesByStatus(pages);
        setTotalsByStatus(totals);
      } catch {
        if (!cancelled) setError('Failed to load board');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [authToken, statusesDep]);

  const hasMoreByStatus = useMemo(() => {
    const result: Record<string, boolean> = {};
    for (const key of Object.keys(featuresByStatus)) {
      const loaded = featuresByStatus[key]?.length ?? 0;
      const total = totalsByStatus[key] ?? 0;
      result[key] = loaded < total;
    }
    return result;
  }, [featuresByStatus, totalsByStatus]);

  const remainingByStatus = useMemo(() => {
    const result: Record<string, number> = {};
    const keys = new Set<string>([
      ...Object.keys(featuresByStatus),
      ...Object.keys(totalsByStatus),
    ]);
    for (const key of keys) {
      const loaded = featuresByStatus[key]?.length ?? 0;
      const total = totalsByStatus[key] ?? 0;
      result[key] = Math.max(total - loaded, 0);
    }
    return result;
  }, [featuresByStatus, totalsByStatus]);

  async function onLoadMore(statusKey: string) {
    const currentPage = pagesByStatus[statusKey] ?? 0;
    const nextPage = currentPage + 1;
    try {
      const resp = await fetchFeaturesByStatus(authToken, statusKey, nextPage, PER_PAGE);
      setFeaturesByStatus((prev) => ({
        ...prev,
        [statusKey]: [...(prev[statusKey] ?? []), ...resp.records],
      }));
      setPagesByStatus((prev) => ({ ...prev, [statusKey]: nextPage }));
      setTotalsByStatus((prev) => ({ ...prev, [statusKey]: resp.total_count ?? (prev[statusKey] ?? 0) }));
      await prefetchDescriptions(resp.records);
    } catch {
      // ignore load more errors silently to keep UX smooth
    }
  }

  async function prefetchDescriptions(features: IndexFeature[]) {
    // Fetch detail for features that don't have a description cached yet (best-effort, parallel)
    const missing = features.filter((f) => !descriptionsById[f.id]);
    if (missing.length === 0) return;
    await Promise.all(
      missing.map(async (f) => {
        try {
          const detail = await fetchFeatureDetail(authToken, f.id);
          setDetailCache((prev) => ({ ...prev, [f.id]: detail }));
          setDescriptionsById((prev) => ({ ...prev, [f.id]: truncateTwoLines(stripHtml(detail.description)) }));
        } catch {
          // ignore
        }
      }),
    );
  }

  function truncateTwoLines(text: string): string {
    // Approximate two lines with ~140 chars, add ellipsis if longer
    const limit = 140;
    if (!text) return '';
    const t = text.trim();
    if (t.length <= limit) return t;
    return t.slice(0, limit - 1) + '…';
  }

  async function handleCardClick(feature: IndexFeature) {
    try {
      const cached = detailCache[feature.id];
      if (cached) {
        setSelected(cached);
        return;
      }
      const detail = await fetchFeatureDetail(authToken, feature.id);
      setDetailCache((prev) => ({ ...prev, [feature.id]: detail }));
      setSelected(detail);
    } catch {
      // ignore error for now; could show toast in future
    }
  }

  if (loading) {
    return (
      <div className={className}>
        <div className='p-4 text-sm text-slate-500 dark:text-slate-300'>Loading board…</div>
      </div>
    );
  }
  if (error || !statuses) {
    return (
      <div className={className}>
        <div className='p-4 text-sm text-red-600'>Error: {error ?? 'Unknown error'}</div>
      </div>
    );
  }

  return (
    <div className={`${className} h-full`}>
      <BoardKanban
        statuses={sortedStatuses}
        featuresByStatus={featuresByStatus}
        hasMoreByStatus={hasMoreByStatus}
        onLoadMore={onLoadMore}
        descriptionsById={descriptionsById}
        onCardClick={handleCardClick}
        remainingByStatus={remainingByStatus}
      />
      <div className='text-xs text-slate-700 dark:text-white mt-2 text-right'>
        <a href='https://upvoted.io' target='_blank' rel='noreferrer'>Powered by Upvoted</a>
      </div>
      {selected && (
        <BoardModal feature={selected} onClose={() => setSelected(null)} allowFeatureComment={allowFeatureComment} authToken={authToken} />
      )}
    </div>
  );
}
