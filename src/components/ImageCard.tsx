import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { PicsumImage } from '../types';
import { theme } from '../theme/theme';
import { useTheme } from '../hooks/useTheme';
import FavoriteButton from './FavoriteButton';

interface ImageCardProps {
  item: PicsumImage;
  onPress?: () => void;
  /** When true, heart always shows filled (favourites screen). */
  forceFavorite?: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - theme.spacing.lg * 3) / 2;

function ImageCard({ item, onPress, forceFavorite }: ImageCardProps) {
  const { colors } = useTheme();
  const thumbnailUrl = `https://picsum.photos/id/${item.id}/400/300`;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: thumbnailUrl }}
        style={[styles.image, { backgroundColor: colors.surfaceVariant }]}
        contentFit="cover"
        transition={150}
        recyclingKey={item.id}
        cachePolicy="memory-disk"
      />

      <FavoriteButton item={item} forceFavorite={forceFavorite} />

      <View style={styles.infoContainer}>
        <Text style={[styles.authorText, { color: colors.text }]} numberOfLines={1}>
          {item.author}
        </Text>
        <Text style={[styles.idText, { color: colors.textSecondary }]}>ID: {item.id}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ImageCard, (prev, next) => prev.item.id === next.item.id);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
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
  },
  infoContainer: {
    padding: theme.spacing.sm,
  },
  authorText: {
    fontSize: 14,
    fontWeight: '600',
  },
  idText: {
    fontSize: 11,
    marginTop: 2,
  },
});
