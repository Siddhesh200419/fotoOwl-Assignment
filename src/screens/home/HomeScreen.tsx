import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useGalleryImages } from '../../hooks/useGalleryImages';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { theme } from '../../theme/theme';
import { useTheme } from '../../hooks/useTheme';
import EmptyState from '../../components/EmptyState';
import SearchBar from '../../components/SearchBar';
import FilterChips, { FilterValue } from '../../components/FilterChips';
import GalleryFlatList from '../../components/GalleryFlatList';
import ScreenContainer from '../../components/ScreenContainer';

const { width } = Dimensions.get('window');

function isAtoM(author: string) {
  const initial = author.trim()[0]?.toUpperCase() ?? '';
  return initial >= 'A' && initial <= 'M';
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterValue>('All');
  const debouncedQuery = useDebouncedValue(searchQuery, 250);

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useGalleryImages(20);

  const allImages = useMemo(() => data?.pages.flatMap((page) => page) ?? [], [data?.pages]);

  const filteredImages = useMemo(() => {
    let result = allImages;

    if (activeFilter === 'A-M') result = result.filter((img) => isAtoM(img.author));
    if (activeFilter === 'N-Z') result = result.filter((img) => !isAtoM(img.author));

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter((img) => img.author.toLowerCase().includes(q));
    }

    return result;
  }, [allImages, activeFilter, debouncedQuery]);

  const emptyDescription = debouncedQuery
    ? `No images found for "${debouncedQuery}" in the "${activeFilter}" filter.`
    : `No images match the "${activeFilter}" filter yet. Scroll down to load more.`;

  const cardWidth = (width - theme.spacing.lg * 3) / 2;

  return (
    <ScreenContainer>
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Gallery</Text>
      </View>

      {!isError && (
        <View style={[styles.controls, { backgroundColor: colors.background }]}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <View style={styles.filterRow}>
            <FilterChips selected={activeFilter} onSelect={setActiveFilter} />
          </View>
        </View>
      )}

      {isLoading ? (
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          keyExtractor={(i) => String(i)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          renderItem={() => (
            <View style={[styles.skeletonCard, { width: cardWidth }]}>
              <View style={[styles.skeletonBlock, { height: cardWidth * 0.9 }]} />
            </View>
          )}
          scrollEnabled={false}
        />
      ) : isError && allImages.length === 0 ? (
        <View style={styles.center}>
          <EmptyState
            iconName="cloud-offline-outline"
            title="Failed to Load Images"
            description="There was a problem fetching images. Check your connection and try again."
            actionLabel="Retry"
            onAction={() => refetch()}
          />
        </View>
      ) : (
        <GalleryFlatList
          images={filteredImages}
          emptyTitle="No Results Found"
          emptyDescription={emptyDescription}
          isFetchingNextPage={isFetchingNextPage}
          isRefetching={isRefetching}
          onRefresh={() => refetch()}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: theme.typography.titleMedium.fontSize,
    fontWeight: theme.typography.titleMedium.fontWeight,
  },
  controls: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  filterRow: {
    marginTop: theme.spacing.xs,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
  skeletonCard: {
    backgroundColor: '#E5E7EB',
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  skeletonBlock: {
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
});
