interface Model {
  id: number;
  created_at: string;
}

export type meta = {
  total?: number,
  page?: number,
  per_page?: number,
}

export interface Topic extends Model {
  title: string;
  content: string;
}
