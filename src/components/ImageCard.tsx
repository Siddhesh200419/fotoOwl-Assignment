import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PicsumImage, RootStackParamList } from '../types';
import { theme } from '../theme/theme';
import { useTheme } from '../hooks/useTheme';
import { useIsFavourite, useFavouritesStore } from '../store/favoritesStore';
import { thumbUrl } from '../utils/imageUrls';
import { hapticMedium } from '../services/haptics';

interface ImageCardProps {
  item: PicsumImage;
  forceFavorite?: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - theme.spacing.lg * 3) / 2;

export default function ImageCard({ item, forceFavorite }: ImageCardProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFavorite = useIsFavourite(item.id);
  const toggleFavourite = useFavouritesStore((s) => s.toggleFavourite);
  const showHeart = forceFavorite || isFavorite;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ImageDetails', { image: item })}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: thumbUrl(item.id) }}
          style={[styles.image, { backgroundColor: colors.surfaceVariant }]}
          contentFit="cover"
          transition={150}
          recyclingKey={item.id}
          cachePolicy="memory-disk"
        />
        <View style={styles.infoContainer}>
          <Text style={[styles.authorText, { color: colors.text }]} numberOfLines={1}>
            {item.author}
          </Text>
          <Text style={[styles.idText, { color: colors.textSecondary }]}>ID: {item.id}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => {
          hapticMedium();
          toggleFavourite(item);
        }}
        activeOpacity={0.7}
        hitSlop={8}
      >
        <Ionicons
          name={showHeart ? 'heart' : 'heart-outline'}
          size={18}
          color={showHeart ? colors.heart : '#FFFFFF'}
        />
      </TouchableOpacity>
    </View>
  );
}

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
  heartButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.xs + 2,
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
