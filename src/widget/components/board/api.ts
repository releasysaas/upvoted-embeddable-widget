import type {
  FeatureListResponse,
  StatusResponse,
} from './types';

const UPVOTED_API_BASE = 'https://upvoted.io/api/boards';

export async function fetchStatuses(token: string): Promise<StatusResponse> {
  const res = await fetch(`${UPVOTED_API_BASE}/statuses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'GET',
  });
  if (!res.ok) throw new Error(`Statuses request failed: ${res.status}`);
  return (await res.json()) as StatusResponse;
}

export async function fetchFeaturesByStatus(
  token: string,
  status: string,
  page = 1,
  perPage = 50,
): Promise<FeatureListResponse> {
  const url = new URL(`${UPVOTED_API_BASE}/features`);
  url.searchParams.set('status', status);
  url.searchParams.set('page', String(page));
  url.searchParams.set('per_page', String(perPage));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'GET',
  });
  if (!res.ok) throw new Error(`Features request failed: ${res.status}`);
  return (await res.json()) as FeatureListResponse;
}
