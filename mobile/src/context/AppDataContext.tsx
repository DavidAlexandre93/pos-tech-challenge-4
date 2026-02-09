import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createPost, deletePost, getPostById, getPosts, type PostPayload, updatePost } from '@/api/posts';
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  type StudentPayload,
  updateStudent
} from '@/api/students';
import {
  createTeacher,
  deleteTeacher,
  getTeacherById,
  getTeachers,
  type TeacherPayload,
  updateTeacher
} from '@/api/teachers';
import { AuthContext } from '@/context/AuthContext';
import type { Post, Student, Teacher } from '@/types';

interface AppDataContextValue {
  posts: Post[];
  students: Student[];
  teachers: Teacher[];
  studentsPage: number;
  studentsTotalPages: number;
  teachersPage: number;
  teachersTotalPages: number;
  loadPosts: () => Promise<void>;
  loadStudents: (page?: number) => Promise<void>;
  loadTeachers: (page?: number) => Promise<void>;
  getPost: (postId: string) => Promise<Post>;
  getStudent: (studentId: string) => Promise<Student>;
  getTeacher: (teacherId: string) => Promise<Teacher>;
  createPost: (payload: PostPayload) => Promise<void>;
  updatePost: (postId: string, payload: PostPayload) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  createStudent: (payload: StudentPayload) => Promise<void>;
  updateStudent: (studentId: string, payload: StudentPayload) => Promise<void>;
  deleteStudent: (studentId: string) => Promise<void>;
  createTeacher: (payload: TeacherPayload) => Promise<void>;
  updateTeacher: (teacherId: string, payload: TeacherPayload) => Promise<void>;
  deleteTeacher: (teacherId: string) => Promise<void>;
}

export const AppDataContext = createContext<AppDataContextValue>({} as AppDataContextValue);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { hasRole } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [studentsPage, setStudentsPage] = useState(1);
  const [studentsTotalPages, setStudentsTotalPages] = useState(1);
  const [teachersPage, setTeachersPage] = useState(1);
  const [teachersTotalPages, setTeachersTotalPages] = useState(1);

  const enforceTeacher = useCallback(() => {
    if (!hasRole('teacher')) {
      throw new Error('Sem permissão para modificar conteúdos.');
    }
  }, [hasRole]);

  const loadPosts = useCallback(async () => {
    const data = await getPosts();
    setPosts(data);
  }, []);

  const loadStudents = useCallback(async (page = 1) => {
    const response = await getStudents(page);
    setStudents(response.data);
    setStudentsPage(response.page);
    setStudentsTotalPages(response.totalPages);
  }, []);

  const loadTeachers = useCallback(async (page = 1) => {
    const response = await getTeachers(page);
    setTeachers(response.data);
    setTeachersPage(response.page);
    setTeachersTotalPages(response.totalPages);
  }, []);

  const createPostHandler = useCallback(
    async (payload: PostPayload) => {
      enforceTeacher();
      await createPost(payload);
      await loadPosts();
    },
    [enforceTeacher, loadPosts]
  );

  const updatePostHandler = useCallback(
    async (postId: string, payload: PostPayload) => {
      enforceTeacher();
      await updatePost(postId, payload);
      await loadPosts();
    },
    [enforceTeacher, loadPosts]
  );

  const deletePostHandler = useCallback(
    async (postId: string) => {
      enforceTeacher();
      await deletePost(postId);
      await loadPosts();
    },
    [enforceTeacher, loadPosts]
  );

  const createStudentHandler = useCallback(
    async (payload: StudentPayload) => {
      enforceTeacher();
      await createStudent(payload);
      await loadStudents(studentsPage);
    },
    [enforceTeacher, loadStudents, studentsPage]
  );

  const updateStudentHandler = useCallback(
    async (studentId: string, payload: StudentPayload) => {
      enforceTeacher();
      await updateStudent(studentId, payload);
      await loadStudents(studentsPage);
    },
    [enforceTeacher, loadStudents, studentsPage]
  );

  const deleteStudentHandler = useCallback(
    async (studentId: string) => {
      enforceTeacher();
      await deleteStudent(studentId);
      await loadStudents(studentsPage);
    },
    [enforceTeacher, loadStudents, studentsPage]
  );

  const createTeacherHandler = useCallback(
    async (payload: TeacherPayload) => {
      enforceTeacher();
      await createTeacher(payload);
      await loadTeachers(teachersPage);
    },
    [enforceTeacher, loadTeachers, teachersPage]
  );

  const updateTeacherHandler = useCallback(
    async (teacherId: string, payload: TeacherPayload) => {
      enforceTeacher();
      await updateTeacher(teacherId, payload);
      await loadTeachers(teachersPage);
    },
    [enforceTeacher, loadTeachers, teachersPage]
  );

  const deleteTeacherHandler = useCallback(
    async (teacherId: string) => {
      enforceTeacher();
      await deleteTeacher(teacherId);
      await loadTeachers(teachersPage);
    },
    [enforceTeacher, loadTeachers, teachersPage]
  );

  const value = useMemo(
    () => ({
      posts,
      students,
      teachers,
      studentsPage,
      studentsTotalPages,
      teachersPage,
      teachersTotalPages,
      loadPosts,
      loadStudents,
      loadTeachers,
      getPost: getPostById,
      getStudent: getStudentById,
      getTeacher: getTeacherById,
      createPost: createPostHandler,
      updatePost: updatePostHandler,
      deletePost: deletePostHandler,
      createStudent: createStudentHandler,
      updateStudent: updateStudentHandler,
      deleteStudent: deleteStudentHandler,
      createTeacher: createTeacherHandler,
      updateTeacher: updateTeacherHandler,
      deleteTeacher: deleteTeacherHandler
    }),
    [
      posts,
      students,
      teachers,
      studentsPage,
      studentsTotalPages,
      teachersPage,
      teachersTotalPages,
      loadPosts,
      loadStudents,
      loadTeachers,
      createPostHandler,
      updatePostHandler,
      deletePostHandler,
      createStudentHandler,
      updateStudentHandler,
      deleteStudentHandler,
      createTeacherHandler,
      updateTeacherHandler,
      deleteTeacherHandler
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}
