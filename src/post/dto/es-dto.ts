export interface PostSearchBody {
  userId: string;
  firstName: string;
  lastName: string;
  id: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
}

export interface PostSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}

export interface UpdatePost {
  id: string;
  description?: string;
  title?: string;
}
