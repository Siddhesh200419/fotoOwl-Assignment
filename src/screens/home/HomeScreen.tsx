import React, { useState, useMemo, useCallback } from 'react';
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
import { useTheme } from '../../hooks/useTheme';
import { PicsumImage } from '../../types';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import SearchBar from '../../components/SearchBar';
import FilterChips, { FilterValue } from '../../components/FilterChips';
import GalleryFlatList from '../../components/GalleryFlatList';

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

function isAtoM(author: string): boolean {
  const initial = author.trim()[0]?.toUpperCase() ?? '';
  return initial >= 'A' && initial <= 'M';
}

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
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

  const allImages = useMemo(
    () => data?.pages.flatMap((page) => page) ?? [],
    [data?.pages]
  );

  const filteredImages = useMemo(() => {
    let result = allImages;

    if (activeFilter === 'A-M') {
      result = result.filter((img) => isAtoM(img.author));
    } else if (activeFilter === 'N-Z') {
      result = result.filter((img) => !isAtoM(img.author));
    }

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter((img) => img.author.toLowerCase().includes(q));
    }

    return result;
  }, [allImages, activeFilter, debouncedQuery]);

  const emptyDescription = useMemo(() => {
    if (debouncedQuery) {
      return `No images found for "${debouncedQuery}" in the "${activeFilter}" filter.`;
    }
    return `No images match the "${activeFilter}" filter yet. Scroll down to load more.`;
  }, [debouncedQuery, activeFilter]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Gallery</Text>
        </View>
        <View style={[styles.controls, { backgroundColor: colors.background }]}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <View style={styles.filterRow}>
            <FilterChips selected={activeFilter} onSelect={setActiveFilter} />
          </View>
        </View>
        <FlatList
          data={Array.from({ length: 6 })}
          keyExtractor={(_, i) => i.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          renderItem={() => <SkeletonCard />}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </SafeAreaView>
    );
  }

  if (isError && allImages.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Gallery</Text>
        </View>
        <View style={styles.center}>
          <EmptyState
            iconName="cloud-offline-outline"
            title="Failed to Load Images"
            description="There was a problem fetching images. Check your connection and try again."
            actionLabel="Retry"
            onAction={handleRetry}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Gallery</Text>
      </View>

      <View style={[styles.controls, { backgroundColor: colors.background }]}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <View style={styles.filterRow}>
          <FilterChips selected={activeFilter} onSelect={setActiveFilter} />
        </View>
      </View>

      <GalleryFlatList
        images={filteredImages}
        emptyTitle="No Results Found"
        emptyDescription={emptyDescription}
        isFetchingNextPage={isFetchingNextPage}
        isRefetching={isRefetching}
        onRefresh={handleRefresh}
        onEndReached={handleEndReached}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
