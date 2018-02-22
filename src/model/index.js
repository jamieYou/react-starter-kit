import type { IObservableArray } from '@store/helper'

interface Model {
  id: number;
  created_at: string;
}

export type meta = {
  total: number,
  page: number,
  per_page: number,
}

export interface Reply extends Model {
  id: string;
  create_at: string;
  author: {
    loginname: string,
    avatar_url: string,
  };
  content: string;
  is_uped: boolean;
  reply_id: string | null;
  ups: IObservableArray<string>;
}

export interface Topic extends Model {
  id: string;
  create_at: string;
  title: string;
  tab: string;
  content: string;
  good: boolean;
  top: boolean;
  last_reply_at: string;
  reply_count: number;
  visit_count: number;
  author: {
    avatar_url: string,
    loginname: string,
  };
  author_id: string; // with_detail
  is_collect?: boolean; // with_detail
  replies?: IObservableArray<Reply>; // with_detail
}
