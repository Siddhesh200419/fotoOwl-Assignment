import React from 'react';
import { FlatList, StyleSheet, View, ViewStyle } from 'react-native';
import { PicsumImage } from '../types';
import { theme } from '../theme/theme';
import ImageCard from './ImageCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

interface GalleryFlatListProps {
  images: PicsumImage[];
  emptyTitle: string;
  emptyDescription: string;
  isFetchingNextPage?: boolean;
  isRefetching?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  contentContainerStyle?: ViewStyle;
  forceFavorite?: boolean;
}

export default function GalleryFlatList({
  images,
  emptyTitle,
  emptyDescription,
  isFetchingNextPage = false,
  isRefetching = false,
  onRefresh,
  onEndReached,
  contentContainerStyle,
  forceFavorite,
}: GalleryFlatListProps) {
  return (
    <FlatList
      data={images}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.listContainer, contentContainerStyle]}
      renderItem={({ item }) => <ImageCard item={item} forceFavorite={forceFavorite} />}
      onRefresh={onRefresh}
      refreshing={isRefetching}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footerLoader}>
            <LoadingSpinner />
          </View>
        ) : null
      }
      ListEmptyComponent={
        <EmptyState iconName="search-outline" title={emptyTitle} description={emptyDescription} />
      }
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 24,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
  },
  footerLoader: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
});
