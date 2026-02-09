export type Role = 'teacher' | 'student';

export interface Post {
  id: string;
  title: string;
  content: string;
  description?: string;
  author: string;
  createdAt?: string;
  comments?: PostComment[];
}

export interface PostComment {
  id?: string;
  author?: string;
  content: string;
  createdAt?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  course?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  role: Role;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
}
