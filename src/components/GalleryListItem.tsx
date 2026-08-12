import React, { memo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PicsumImage, RootStackParamList } from '../types';
import ImageCard from './ImageCard';
import { hapticTap } from '../services/haptics';

type RootStackNavProp = NativeStackNavigationProp<RootStackParamList>;

interface GalleryListItemProps {
  item: PicsumImage;
  forceFavorite?: boolean;
}

function GalleryListItem({ item, forceFavorite }: GalleryListItemProps) {
  const navigation = useNavigation<RootStackNavProp>();

  const handlePress = useCallback(() => {
    hapticTap();
    navigation.navigate('ImageDetails', { image: item });
  }, [navigation, item]);

  return (
    <ImageCard item={item} onPress={handlePress} forceFavorite={forceFavorite} />
  );
}

export default memo(GalleryListItem, (prev, next) => prev.item.id === next.item.id);
