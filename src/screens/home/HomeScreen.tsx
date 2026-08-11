import React from 'react';
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
import { theme } from '../../theme/theme';
import ImageCard from '../../components/ImageCard';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';

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

export default function HomeScreen() {
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

  // Flatten the pages array returned by useInfiniteQuery
  const images = data?.pages.flatMap((page) => page) || [];

  const handleEndReached = () => {
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gallery</Text>
        </View>
        <FlatList
          data={Array.from({ length: 6 })}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          renderItem={() => <SkeletonCard />}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  if (isError && images.length === 0) {
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
            description="There was a problem fetching images from the Picsum server. Check your connection."
            actionLabel="Retry"
            onAction={refetch}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gallery</Text>
      </View>

      <FlatList
        data={images}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ImageCard
            item={item}
            onPress={() => console.log('Tapped image:', item.id)}
            onFavoriteToggle={() => console.log('Toggled favorite for:', item.id)}
          />
        )}
        onRefresh={refetch}
        refreshing={isRefetching}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <EmptyState
            title="No Images Available"
            description="There are currently no photos to display in the gallery."
            actionLabel="Refresh"
            onAction={refetch}
          />
        }
        showsVerticalScrollIndicator={false}
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
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
  footerLoader: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  // Skeleton Styles
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
