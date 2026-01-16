import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
  onPress?: () => void;
}

export function PostCard({ post, onPress }: PostCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.meta}>Por {post.author}</Text>
      <Text numberOfLines={3} style={styles.description}>
        {post.description || post.content}
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
