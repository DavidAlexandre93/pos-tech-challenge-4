import React, { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiRequest } from '@/api/client';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { Post } from '@/types';
import { ROUTES } from '@/utils/constants';

export function AdminPostsScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState<Post[]>([]);

  async function loadPosts() {
    const data = await apiRequest<Post[]>('/posts');
    setPosts(data);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleDelete(postId: string) {
    try {
      await apiRequest(`/posts/${postId}`, { method: 'DELETE' });
      Alert.alert('Postagens', 'Post removido com sucesso.');
      loadPosts();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao remover post.';
      Alert.alert('Postagens', message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
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
                onPress={() => navigation.navigate(ROUTES.postEdit as never, { postId: item.id } as never)}
              />
              <PrimaryButton label="Excluir" variant="danger" onPress={() => handleDelete(item.id)} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma postagem cadastrada.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1F5F9'
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
