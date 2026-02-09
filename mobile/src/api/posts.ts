import { apiRequest } from '@/api/client';
import type { Post } from '@/types';

export interface PostPayload {
  title: string;
  content: string;
  author: string;
}

export function getPosts() {
  return apiRequest<Post[]>('/posts');
}

export function getPostById(postId: string) {
  return apiRequest<Post>(`/posts/${postId}`);
}

export function createPost(payload: PostPayload) {
  return apiRequest<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updatePost(postId: string, payload: PostPayload) {
  return apiRequest<Post>(`/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deletePost(postId: string) {
  return apiRequest<void>(`/posts/${postId}`, { method: 'DELETE' });
}
