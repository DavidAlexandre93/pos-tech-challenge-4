import { apiRequest } from '@/api/client';
import type { PaginatedResponse, Student } from '@/types';

export interface StudentPayload {
  name: string;
  email: string;
  course: string;
}

export function getStudents(page = 1) {
  return apiRequest<PaginatedResponse<Student>>(`/students?page=${page}`);
}

export function getStudentById(studentId: string) {
  return apiRequest<Student>(`/students/${studentId}`);
}

export function createStudent(payload: StudentPayload) {
  return apiRequest<Student>('/students', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateStudent(studentId: string, payload: StudentPayload) {
  return apiRequest<Student>(`/students/${studentId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteStudent(studentId: string) {
  return apiRequest<void>(`/students/${studentId}`, { method: 'DELETE' });
}
