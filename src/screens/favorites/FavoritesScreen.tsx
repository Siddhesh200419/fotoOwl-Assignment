import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useFavouritesStore } from '../../store/favoritesStore';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { theme } from '../../theme/theme';
import { useTheme } from '../../hooks/useTheme';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import GalleryFlatList from '../../components/GalleryFlatList';

export default function FavoritesScreen() {
  const { colors, isDark } = useTheme();
  const favourites = useFavouritesStore((state) => state.favourites);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 250);

  const allFavourites = useMemo(() => Object.values(favourites), [favourites]);

  const filteredFavourites = useMemo(() => {
    if (!debouncedQuery.trim()) return allFavourites;
    const q = debouncedQuery.toLowerCase();
    return allFavourites.filter((img) => img.author.toLowerCase().includes(q));
  }, [allFavourites, debouncedQuery]);

  const emptyDescription = useMemo(
    () => `No favourites match "${debouncedQuery}".`,
    [debouncedQuery]
  );

  if (allFavourites.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Favourites</Text>
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Favourites</Text>
        <Text style={[styles.countText, { color: colors.textSecondary }]}>{allFavourites.length} saved</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search favourites…"
        />
      </View>

      <GalleryFlatList
        images={filteredFavourites}
        emptyTitle="No Results"
        emptyDescription={emptyDescription}
        forceFavorite
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: theme.typography.titleMedium.fontSize,
    fontWeight: theme.typography.titleMedium.fontWeight,
  },
  countText: {
    fontSize: 13,
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
});
