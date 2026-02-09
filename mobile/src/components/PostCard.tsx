import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
}

export function PostCard({ post, onPress }: PostCardProps) {
  const briefDescription = (post.description || post.content || '').trim();
  const preview =
    briefDescription.length > 140 ? `${briefDescription.slice(0, 137).trimEnd()}...` : briefDescription;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir postagem ${post.title}`}
      onPress={onPress}
      style={styles.card}
    >
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.meta}>Por {post.author}</Text>
      <Text numberOfLines={3} style={styles.description}>
        {preview}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A'
  },
  meta: {
    fontSize: 12,
    color: '#475569',
    marginVertical: 4
  },
  description: {
    fontSize: 14,
    color: '#1E293B'
  }
});
