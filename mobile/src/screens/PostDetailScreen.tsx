import React, { useContext, useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { apiRequest } from '@/api/client';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { AppDataContext } from '@/context/AppDataContext';
import type { PostsStackParamList } from '@/navigation/AppTabs';
import { ROUTES } from '@/utils/constants';
import type { Post, PostComment } from '@/types';

export function PostDetailScreen() {
  const route = useRoute<RouteProp<PostsStackParamList, typeof ROUTES.postDetail>>();
  const { getPost } = useContext(AppDataContext);
  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getPost(postId);
        setPost(data);
        setComments(data.comments ?? []);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao carregar post.';
        Alert.alert('Post', message);
      }
    }

    loadPost();
  }, [getPost, postId]);

  async function handleComment() {
    const trimmedComment = comment.trim();
    if (!trimmedComment) return;

    try {
      setIsSubmittingComment(true);
      const createdComment = await apiRequest<PostComment>(`/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: trimmedComment })
      });

      setComments((currentComments) => {
        if (createdComment?.content) {
          return [...currentComments, createdComment];
        }

        return [...currentComments, { content: trimmedComment }];
      });

      setComment('');
      Alert.alert('Comentário', 'Comentário enviado com sucesso.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao enviar comentário.';
      Alert.alert('Comentário', message);
    } finally {
      setIsSubmittingComment(false);
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
          {comments.length > 0 ? (
            comments.map((item, index) => (
              <View key={item.id ?? `${item.content}-${index}`} style={styles.commentItem}>
                <Text style={styles.commentAuthor}>{item.author || 'Leitor'}</Text>
                <Text style={styles.commentText}>{item.content}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyComments}>Ainda não há comentários.</Text>
          )}
          <TextField label="Adicionar comentário" value={comment} onChangeText={setComment} multiline />
          <PrimaryButton
            label={isSubmittingComment ? 'Enviando...' : 'Enviar comentário'}
            onPress={handleComment}
            disabled={isSubmittingComment}
          />
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
  },
  commentItem: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F8FAFC'
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4
  },
  commentText: {
    color: '#1E293B'
  },
  emptyComments: {
    marginBottom: 12,
    color: '#64748B'
  }
});
