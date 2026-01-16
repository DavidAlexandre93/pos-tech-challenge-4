import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { apiRequest } from '@/api/client';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import type { Post } from '@/types';

interface PostDetailParams {
  postId: string;
}

export function PostDetailScreen() {
  const route = useRoute<RouteProp<Record<string, PostDetailParams>, string>>();
  const { postId } = route.params as PostDetailParams;
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    async function loadPost() {
      const data = await apiRequest<Post>(`/posts/${postId}`);
      setPost(data);
    }

    loadPost();
  }, [postId]);

  async function handleComment() {
    if (!comment.trim()) return;
    try {
      await apiRequest(`/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: comment })
      });
      setComment('');
      Alert.alert('Comentário', 'Comentário enviado com sucesso.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao enviar comentário.';
      Alert.alert('Comentário', message);
    }
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.meta}>Por {post.author}</Text>
        <Text style={styles.body}>{post.content}</Text>
        <View style={styles.commentBox}>
          <Text style={styles.sectionTitle}>Comentários</Text>
          <TextField label="Adicionar comentário" value={comment} onChangeText={setComment} multiline />
          <PrimaryButton label="Enviar comentário" onPress={handleComment} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  content: {
    padding: 20
  },
  loading: {
    textAlign: 'center',
    marginTop: 32,
    color: '#64748B'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A'
  },
  meta: {
    marginVertical: 8,
    color: '#64748B'
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1E293B'
  },
  commentBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12
  }
});
