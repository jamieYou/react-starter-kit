import type { IObservableArray } from '@store/helper'

interface Model {
  id: number;
  created_at: string;
}

export type meta = {
  total?: number,
  page?: number,
  per_page?: number,
}

export interface SimpleTopic extends Model {
  id: string;
  create_at: string;
  title: string;
  tab: string;
  content: string;
  title: string;
  good: boolean;
  top: boolean;
  last_reply_at: string;
  reply_count: string;
  visit_count: string;
  author: {
    avatar_url: string,
    loginname: string,
  };
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

export interface Topic extends SimpleTopic {
  author_id: string;
  is_collect: boolean;
  replies: IObservableArray<Reply>;
}
