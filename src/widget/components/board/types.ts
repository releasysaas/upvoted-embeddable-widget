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

export type ShowFeature = {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  status: string;
  inserted_at: string;
  public_upvotes_count: number;
  private_upvotes_count: number;
  comments_count: number;
  contributor?: { name?: string; email?: string } | null;
  comments: Array<{
    id: string;
    message: string;
    inserted_at: string;
    contributor?: { name?: string; email?: string } | null;
  }>;
  votes: Array<{
    public: boolean;
    inserted_at: string;
    contributor?: { name?: string; email?: string } | null;
  }>;
  custom_fields?: Record<string, unknown> | null;
  url: string;
  public_url?: string | null;
  board?: { name?: string; slug?: string } | null;
};
