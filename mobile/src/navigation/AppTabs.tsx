import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '@/context/AuthContext';
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

const Tab = createBottomTabNavigator();
const PostsStack = createNativeStackNavigator();
const TeachersStack = createNativeStackNavigator();
const StudentsStack = createNativeStackNavigator();
const AdminStack = createNativeStackNavigator();

function PostsStackNavigator() {
  const { hasRole } = useContext(AuthContext);

  return (
    <PostsStack.Navigator>
      <PostsStack.Screen name={ROUTES.posts} component={PostListScreen} options={{ title: 'Posts' }} />
      <PostsStack.Screen
        name={ROUTES.postDetail}
        component={PostDetailScreen}
        options={{ title: 'Leitura' }}
      />
      {hasRole('teacher') && (
        <>
          <PostsStack.Screen
            name={ROUTES.postCreate}
            component={PostCreateScreen}
            options={{ title: 'Nova postagem' }}
          />
          <PostsStack.Screen
            name={ROUTES.postEdit}
            component={PostEditScreen}
            options={{ title: 'Editar postagem' }}
          />
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
        options={{ title: 'Cadastro docente' }}
      />
    </TeachersStack.Navigator>
  );
}

function StudentsStackNavigator() {
  return (
    <StudentsStack.Navigator>
      <StudentsStack.Screen name={ROUTES.students} component={StudentsListScreen} options={{ title: 'Alunos' }} />
      <StudentsStack.Screen
        name={ROUTES.studentForm}
        component={StudentFormScreen}
        options={{ title: 'Cadastro aluno' }}
      />
    </StudentsStack.Navigator>
  );
}

function AdminStackNavigator() {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen name={ROUTES.adminPosts} component={AdminPostsScreen} options={{ title: 'Admin' }} />
      <AdminStack.Screen
        name={ROUTES.postEdit}
        component={PostEditScreen}
        options={{ title: 'Editar postagem' }}
      />
    </AdminStack.Navigator>
  );
}

export function AppTabs() {
  const { hasRole } = useContext(AuthContext);

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
