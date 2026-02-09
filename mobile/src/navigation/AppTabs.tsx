import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/hooks/useAuth';
import { AdminPostsScreen } from '@/screens/AdminPostsScreen';
import { PostCreateScreen } from '@/screens/PostCreateScreen';
import { PostDetailScreen } from '@/screens/PostDetailScreen';
import { PostEditScreen } from '@/screens/PostEditScreen';
import { PostListScreen } from '@/screens/PostListScreen';
import { StudentFormScreen } from '@/screens/StudentFormScreen';
import { StudentsListScreen } from '@/screens/StudentsListScreen';
import { TeacherFormScreen } from '@/screens/TeacherFormScreen';
import { TeachersListScreen } from '@/screens/TeachersListScreen';
import { ROUTES } from '@/utils/constants';

export type PostsStackParamList = {
  [ROUTES.posts]: undefined;
  [ROUTES.postDetail]: { postId: string };
  [ROUTES.postCreate]: undefined;
  [ROUTES.postEdit]: { postId: string };
};

export type TeachersStackParamList = {
  [ROUTES.teachers]: undefined;
  [ROUTES.teacherForm]: { teacherId?: string } | undefined;
};

export type StudentsStackParamList = {
  [ROUTES.students]: undefined;
  [ROUTES.studentForm]: { studentId?: string } | undefined;
};

export type AdminStackParamList = {
  [ROUTES.adminPosts]: undefined;
  [ROUTES.postEdit]: { postId: string };
};

type AppTabsParamList = {
  Posts: undefined;
  Docentes: undefined;
  Alunos: undefined;
  Admin: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();
const PostsStack = createNativeStackNavigator<PostsStackParamList>();
const TeachersStack = createNativeStackNavigator<TeachersStackParamList>();
const StudentsStack = createNativeStackNavigator<StudentsStackParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();

function PostsStackNavigator() {
  const { hasRole } = useAuth();

  return (
    <PostsStack.Navigator>
      <PostsStack.Screen name={ROUTES.posts} component={PostListScreen} options={{ title: 'Posts' }} />
      <PostsStack.Screen name={ROUTES.postDetail} component={PostDetailScreen} options={{ title: 'Leitura' }} />
      {hasRole('teacher') && (
        <>
          <PostsStack.Screen name={ROUTES.postCreate} component={PostCreateScreen} options={{ title: 'Nova postagem' }} />
          <PostsStack.Screen name={ROUTES.postEdit} component={PostEditScreen} options={{ title: 'Editar postagem' }} />
        </>
      )}
    </PostsStack.Navigator>
  );
}

function TeachersStackNavigator() {
  return (
    <TeachersStack.Navigator>
      <TeachersStack.Screen name={ROUTES.teachers} component={TeachersListScreen} options={{ title: 'Docentes' }} />
      <TeachersStack.Screen
        name={ROUTES.teacherForm}
        component={TeacherFormScreen}
        options={({ route }) => ({ title: route.params?.teacherId ? 'Editar docente' : 'Cadastro docente' })}
      />
    </TeachersStack.Navigator>
  );
}

function StudentsStackNavigator() {
  return (
    <StudentsStack.Navigator>
      <StudentsStack.Screen name={ROUTES.students} component={StudentsListScreen} options={{ title: 'Alunos' }} />
      <StudentsStack.Screen name={ROUTES.studentForm} component={StudentFormScreen} options={{ title: 'Cadastro aluno' }} />
    </StudentsStack.Navigator>
  );
}

function AdminStackNavigator() {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen name={ROUTES.adminPosts} component={AdminPostsScreen} options={{ title: 'Admin' }} />
      <AdminStack.Screen name={ROUTES.postEdit} component={PostEditScreen} options={{ title: 'Editar postagem' }} />
    </AdminStack.Navigator>
  );
}

export function AppTabs() {
  const { hasRole } = useAuth();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Posts" component={PostsStackNavigator} />
      {hasRole('teacher') && (
        <>
          <Tab.Screen name="Docentes" component={TeachersStackNavigator} />
          <Tab.Screen name="Alunos" component={StudentsStackNavigator} />
          <Tab.Screen name="Admin" component={AdminStackNavigator} />
        </>
      )}
    </Tab.Navigator>
  );
}
