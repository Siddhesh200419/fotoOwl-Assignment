import React, { memo, useCallback } from 'react';
import { FlatList, StyleSheet, View, ViewStyle } from 'react-native';
import { PicsumImage } from '../types';
import { theme } from '../theme/theme';
import GalleryListItem from './GalleryListItem';
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

const keyExtractor = (item: PicsumImage) => item.id;

function GalleryFlatList({
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
  const renderItem = useCallback(
    ({ item }: { item: PicsumImage }) => (
      <GalleryListItem item={item} forceFavorite={forceFavorite} />
    ),
    [forceFavorite]
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <LoadingSpinner />
      </View>
    );
  }, [isFetchingNextPage]);

  const ListEmptyComponent = useCallback(
    () => (
      <EmptyState
        iconName="search-outline"
        title={emptyTitle}
        description={emptyDescription}
      />
    ),
    [emptyTitle, emptyDescription]
  );

  return (
    <FlatList
      data={images}
      keyExtractor={keyExtractor}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.listContainer, contentContainerStyle]}
      renderItem={renderItem}
      onRefresh={onRefresh}
      refreshing={isRefetching}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={ListEmptyComponent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      removeClippedSubviews
      maxToRenderPerBatch={8}
      windowSize={7}
      initialNumToRender={10}
      updateCellsBatchingPeriod={50}
    />
  );
}

export default memo(GalleryFlatList);

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
