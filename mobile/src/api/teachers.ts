import { apiRequest } from '@/api/client';
import type { PaginatedResponse, Teacher } from '@/types';

export interface TeacherPayload {
  name: string;
  email: string;
  department: string;
}

export function getTeachers(page = 1) {
  return apiRequest<PaginatedResponse<Teacher>>(`/teachers?page=${page}`);
}

export function getTeacherById(teacherId: string) {
  return apiRequest<Teacher>(`/teachers/${teacherId}`);
}

export function createTeacher(payload: TeacherPayload) {
  return apiRequest<Teacher>('/teachers', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateTeacher(teacherId: string, payload: TeacherPayload) {
  return apiRequest<Teacher>(`/teachers/${teacherId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteTeacher(teacherId: string) {
  return apiRequest<void>(`/teachers/${teacherId}`, { method: 'DELETE' });
}
