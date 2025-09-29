export type StatusRecord = {
  name: string;
  order: number;
  is_final: boolean;
  is_initial: boolean;
};

export type StatusResponse = {
  records: StatusRecord[];
};

export type IndexFeature = {
  id: string;
  title: string;
  status: string;
  image?: string | null;
  inserted_at: string;
  public_upvotes_count: number;
  private_upvotes_count: number;
  comments_count: number;
  contributor?: { name?: string; email?: string } | null;
  url: string;
};

export type FeatureListResponse = {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
  records: IndexFeature[];
};
