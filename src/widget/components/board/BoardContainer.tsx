import { useEffect, useMemo, useState } from 'react';
import { BoardKanban } from './BoardKanban';
import { fetchFeaturesByStatus, fetchStatuses } from './api';
import type { IndexFeature, StatusRecord } from './types';

type Props = {
  authToken: string;
  className: string;
  statusesFilter?: string[]; // list of lowercased status names to include; if undefined -> include all
};

const PER_PAGE = 5;

export function BoardContainer({ authToken, className, statusesFilter }: Props) {
  const [statuses, setStatuses] = useState<StatusRecord[] | null>(null);
  const [featuresByStatus, setFeaturesByStatus] = useState<Record<string, IndexFeature[]>>({});
  const [pagesByStatus, setPagesByStatus] = useState<Record<string, number>>({});
  const [totalsByStatus, setTotalsByStatus] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  async function onLoadMore(statusKey: string) {
    const currentPage = pagesByStatus[statusKey] ?? 0;
    const nextPage = currentPage + 1;
    try {
      const resp = await fetchFeaturesByStatus(authToken, statusKey, nextPage, PER_PAGE);
      setFeaturesByStatus((prev) => ({
        ...prev,
        [statusKey]: [ ...(prev[statusKey] ?? []), ...resp.records ],
      }));
      setPagesByStatus((prev) => ({ ...prev, [statusKey]: nextPage }));
      setTotalsByStatus((prev) => ({ ...prev, [statusKey]: resp.total_count ?? (prev[statusKey] ?? 0) }));
    } catch {
      // ignore load more errors silently to keep UX smooth
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
    <div className={className}>
      <BoardKanban
        statuses={sortedStatuses}
        featuresByStatus={featuresByStatus}
        hasMoreByStatus={hasMoreByStatus}
        onLoadMore={onLoadMore}
      />
      <div className='text-xs text-slate-700 dark:text-white mt-2 text-right'>
        <a href='https://upvoted.io' target='_blank' rel='noreferrer'>Powered by Upvoted</a>
      </div>
    </div>
  );
}
