import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useGalleryImages } from '../../hooks/useGalleryImages';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { theme } from '../../theme/theme';
import { PicsumImage } from '../../types';
import ImageCard from '../../components/ImageCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import SearchBar from '../../components/SearchBar';
import FilterChips, { FilterValue } from '../../components/FilterChips';
import { useFavouritesStore } from '../../store/favoritesStore';

const { width } = Dimensions.get('window');

const SkeletonCard = () => {
  const cardWidth = (width - theme.spacing.lg * 3) / 2;
  return (
    <View style={[styles.skeletonCard, { width: cardWidth }]}>
      <View style={[styles.skeletonImage, { height: cardWidth * 0.9 }]} />
      <View style={styles.skeletonInfo}>
        <View style={styles.skeletonText1} />
        <View style={styles.skeletonText2} />
      </View>
    </View>
  );
};

/** Returns true if the author's first initial falls in A–M (case-insensitive). */
function isAtoM(author: string): boolean {
  const initial = author.trim()[0]?.toUpperCase() ?? '';
  return initial >= 'A' && initial <= 'M';
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterValue>('All');
  const { isFavourite, toggleFavourite } = useFavouritesStore();
  const debouncedQuery = useDebouncedValue(searchQuery, 300);

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

  // Flatten all fetched pages into one flat list
  const allImages: PicsumImage[] = data?.pages.flatMap((page) => page) ?? [];

  // Apply filter chip first, then search — both client-side on fetched pages only
  const filteredImages = useMemo(() => {
    let result = allImages;

    // Filter by author initial bucket
    if (activeFilter === 'A-M') {
      result = result.filter((img) => isAtoM(img.author));
    } else if (activeFilter === 'N-Z') {
      result = result.filter((img) => !isAtoM(img.author));
    }

    // Search by author name (case-insensitive)
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter((img) => img.author.toLowerCase().includes(q));
    }

    return result;
  }, [allImages, activeFilter, debouncedQuery]);

  const handleEndReached = () => {
    // Only paginate when not actively filtering — filtering operates on fetched pages;
    // scrolling more extends what's searchable (per AGENTS.md known assumption).
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <LoadingSpinner />
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.controls}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <View style={styles.filterRow}>
        <FilterChips selected={activeFilter} onSelect={setActiveFilter} />
      </View>
    </View>
  );

  // ── Initial skeleton load ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gallery</Text>
        </View>
        {renderHeader()}
        <FlatList
          data={Array.from({ length: 6 })}
          keyExtractor={(_, i) => i.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          renderItem={() => <SkeletonCard />}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  // ── Full error (no data at all) ────────────────────────────────────────
  if (isError && allImages.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gallery</Text>
        </View>
        <View style={styles.center}>
          <EmptyState
            iconName="cloud-offline-outline"
            title="Failed to Load Images"
            description="There was a problem fetching images. Check your connection and try again."
            actionLabel="Retry"
            onAction={() => void refetch()}
          />
        </View>
      </SafeAreaView>
    );
  }

  // ── Main gallery list ──────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gallery</Text>
      </View>

      <FlatList
        data={filteredImages}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <ImageCard
            item={item}
            onPress={() => console.log('Tapped image:', item.id)}
            isFavorite={isFavourite(item.id)}
            onFavoriteToggle={() => toggleFavourite(item)}
          />
        )}
        onRefresh={refetch}
        refreshing={isRefetching}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <EmptyState
            iconName="search-outline"
            title="No Results Found"
            description={
              debouncedQuery
                ? `No images found for "${debouncedQuery}" in the "${activeFilter}" filter.`
                : `No images match the "${activeFilter}" filter yet. Scroll down to load more.`
            }
          />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.border,
    backgroundColor: theme.colors.light.background,
  },
  headerTitle: {
    fontSize: theme.typography.titleMedium.fontSize,
    fontWeight: theme.typography.titleMedium.fontWeight,
    color: theme.colors.light.text,
  },
  controls: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.light.background,
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
  footerLoader: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  // ── Skeleton ────────────────────────────────────────────────────────────
  skeletonCard: {
    backgroundColor: '#E5E7EB',
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  skeletonImage: {
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
  skeletonInfo: {
    padding: theme.spacing.sm,
  },
  skeletonText1: {
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: theme.borderRadius.sm,
    width: '70%',
    marginBottom: 6,
  },
  skeletonText2: {
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: theme.borderRadius.sm,
    width: '40%',
  },
});
