import { useEffect, useMemo, useState } from 'react';
import { BoardKanban } from './BoardKanban';
import { fetchFeaturesByStatus, fetchStatuses } from './api';
import type { IndexFeature, StatusRecord } from './types';

export function BoardContainer({ authToken, className }: { authToken: string; className: string }) {
  const [statuses, setStatuses] = useState<StatusRecord[] | null>(null);
  const [featuresByStatus, setFeaturesByStatus] = useState<Record<string, IndexFeature[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortedStatuses = useMemo(() => {
    return (statuses ?? []).slice().sort((a, b) => a.order - b.order);
  }, [statuses]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const statusesResp = await fetchStatuses(authToken);
        if (cancelled) return;
        setStatuses(statusesResp.records);

        const byStatus: Record<string, IndexFeature[]> = {};
        // Fetch features for each status in parallel (best effort)
        await Promise.all(
          statusesResp.records.map(async (s) => {
            const statusKey = s.name.toLowerCase();
            try {
              const featuresResp = await fetchFeaturesByStatus(authToken, statusKey, 1, 50);
              byStatus[statusKey] = featuresResp.records;
            } catch {
              // individual status failure shouldn't block others
              byStatus[statusKey] = [];
            }
          }),
        );
        if (cancelled) return;
        setFeaturesByStatus(byStatus);
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
  }, [authToken]);

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
      <BoardKanban statuses={sortedStatuses} featuresByStatus={featuresByStatus} />
      <div className='text-xs text-slate-700 dark:text-white mt-2 text-right'>
        <a href='https://upvoted.io' target='_blank' rel='noreferrer'>Powered by Upvoted</a>
      </div>
    </div>
  );
}
