import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { PicsumImage } from '../types';
import { theme } from '../theme/theme';

interface ImageCardProps {
  item: PicsumImage;
  onPress?: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - theme.spacing.lg * 3) / 2;

export default function ImageCard({ item, onPress, isFavorite = false, onFavoriteToggle }: ImageCardProps) {
  // Optimize image load by fetching a downscaled version (400x300) for thumbnails
  const thumbnailUrl = `https://picsum.photos/id/${item.id}/400/300`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
        placeholderContentFit="cover"
      />

      <TouchableOpacity
        style={styles.heartButton}
        onPress={onFavoriteToggle}
        activeOpacity={0.7}
        hitSlop={8}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={18}
          color={isFavorite ? theme.colors.light.heart : '#FFFFFF'}
        />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.authorText} numberOfLines={1}>
          {item.author}
        </Text>
        <Text style={styles.idText}>ID: {item.id}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.light.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    marginBottom: theme.spacing.lg,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 0.9,
    backgroundColor: theme.colors.light.surfaceVariant,
  },
  heartButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.xs + 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: theme.spacing.sm,
  },
  authorText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.light.text,
  },
  idText: {
    fontSize: 11,
    color: theme.colors.light.textSecondary,
    marginTop: 2,
  },
});
