import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TeacherOnly } from '@/components/TeacherOnly';
import { AppDataContext } from '@/context/AppDataContext';
import type { AdminStackParamList } from '@/navigation/AppTabs';
import { ROUTES } from '@/utils/constants';

export function AdminPostsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const { posts, loadPosts, deletePost } = useContext(AppDataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshList = useCallback(async () => {
    await loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    refreshList().finally(() => setIsLoading(false));
  }, [refreshList]);

  async function handleRefresh() {
    setIsRefreshing(true);
    await refreshList();
    setIsRefreshing(false);
  }

  async function handleDelete(postId: string) {
    try {
      await deletePost(postId);
      Alert.alert('Postagens', 'Post removido com sucesso.');
      await refreshList();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao remover post.';
      Alert.alert('Postagens', message);
    }
  }

  function confirmDelete(postId: string, postTitle: string) {
    Alert.alert('Excluir postagem', `Deseja excluir a postagem "${postTitle}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => handleDelete(postId) }
    ]);
  }

  return (
    <TeacherOnly>
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#334155" />
            <Text style={styles.loaderText}>Carregando postagens...</Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>Por {item.author}</Text>
                <View style={styles.actions}>
                  <PrimaryButton
                    label="Editar"
                    variant="outline"
                    onPress={() => navigation.navigate(ROUTES.postEdit, { postId: item.id })}
                  />
                  <PrimaryButton label="Excluir" variant="danger" onPress={() => confirmDelete(item.id, item.title)} />
                </View>
              </View>
            )}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
            ListEmptyComponent={<Text style={styles.empty}>Nenhuma postagem cadastrada.</Text>}
          />
        )}
      </SafeAreaView>
    </TeacherOnly>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1F5F9'
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loaderText: {
    marginTop: 8,
    color: '#475569'
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 12
  },
  title: {
    fontSize: 16,
    fontWeight: '700'
  },
  subtitle: {
    color: '#475569',
    marginBottom: 8
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  empty: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 24
  }
});
