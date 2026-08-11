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
import { useFavouritesStore } from '../../store/favoritesStore';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { theme } from '../../theme/theme';
import ImageCard from '../../components/ImageCard';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';

const { width } = Dimensions.get('window');

export default function FavoritesScreen() {
  const { favourites, toggleFavourite } = useFavouritesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 300);

  // Convert the Record to an array of images
  const allFavourites = useMemo(() => Object.values(favourites), [favourites]);

  // Client-side search on author name
  const filteredFavourites = useMemo(() => {
    if (!debouncedQuery.trim()) return allFavourites;
    const q = debouncedQuery.toLowerCase();
    return allFavourites.filter((img) => img.author.toLowerCase().includes(q));
  }, [allFavourites, debouncedQuery]);

  const renderHeader = () => (
    <View style={styles.searchContainer}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search favourites…"
      />
    </View>
  );

  if (allFavourites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Favourites</Text>
        </View>
        <View style={styles.center}>
          <EmptyState
            iconName="heart-outline"
            title="No Favourites Yet"
            description="Tap the heart icon on any image in the Gallery to save it here."
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favourites</Text>
        <Text style={styles.countText}>{allFavourites.length} saved</Text>
      </View>

      <FlatList
        data={filteredFavourites}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <ImageCard
            item={item}
            isFavorite={true}
            onFavoriteToggle={() => toggleFavourite(item)}
            onPress={() => console.log('Tapped favourite:', item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            iconName="search-outline"
            title="No Results"
            description={`No favourites match "${debouncedQuery}".`}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: theme.typography.titleMedium.fontSize,
    fontWeight: theme.typography.titleMedium.fontWeight,
    color: theme.colors.light.text,
  },
  countText: {
    fontSize: 13,
    color: theme.colors.light.textSecondary,
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
});
