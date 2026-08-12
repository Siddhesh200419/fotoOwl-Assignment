import React, { memo, useCallback } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PicsumImage } from '../types';
import { theme } from '../theme/theme';
import { useTheme } from '../hooks/useTheme';
import { hapticMedium } from '../services/haptics';
import { useIsFavourite, useToggleFavourite } from '../store/favoritesStore';

interface FavoriteButtonProps {
  item: PicsumImage;
  /** When true, skips store lookup (e.g. favourites screen). */
  forceFavorite?: boolean;
}

function FavoriteButton({ item, forceFavorite = false }: FavoriteButtonProps) {
  const { colors } = useTheme();
  const isFavorite = useIsFavourite(item.id);
  const toggleFavourite = useToggleFavourite();
  const showFavorite = forceFavorite || isFavorite;

  const handlePress = useCallback(() => {
    hapticMedium();
    toggleFavourite(item);
  }, [item, toggleFavourite]);

  return (
    <TouchableOpacity
      style={styles.heartButton}
      onPress={handlePress}
      activeOpacity={0.7}
      hitSlop={8}
    >
      <Ionicons
        name={showFavorite ? 'heart' : 'heart-outline'}
        size={18}
        color={showFavorite ? colors.heart : '#FFFFFF'}
      />
    </TouchableOpacity>
  );
}

export default memo(FavoriteButton);

const styles = StyleSheet.create({
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
});
