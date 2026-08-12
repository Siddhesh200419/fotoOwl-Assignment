import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFavouritesStore } from '../../store/favoritesStore';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { theme } from '../../theme/theme';
import { useTheme } from '../../hooks/useTheme';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import GalleryFlatList from '../../components/GalleryFlatList';
import ScreenContainer from '../../components/ScreenContainer';

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const favourites = useFavouritesStore((state) => state.favourites);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 250);

  const allFavourites = useMemo(() => Object.values(favourites), [favourites]);

  const filteredFavourites = useMemo(() => {
    if (!debouncedQuery.trim()) return allFavourites;
    const q = debouncedQuery.toLowerCase();
    return allFavourites.filter((img) => img.author.toLowerCase().includes(q));
  }, [allFavourites, debouncedQuery]);

  return (
    <ScreenContainer>
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Favourites</Text>
        {allFavourites.length > 0 && (
          <Text style={[styles.countText, { color: colors.textSecondary }]}>
            {allFavourites.length} saved
          </Text>
        )}
      </View>

      {allFavourites.length === 0 ? (
        <View style={styles.center}>
          <EmptyState
            iconName="heart-outline"
            title="No Favourites Yet"
            description="Tap the heart icon on any image in the Gallery to save it here."
          />
        </View>
      ) : (
        <>
          <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search favourites…" />
          </View>
          <GalleryFlatList
            images={filteredFavourites}
            emptyTitle="No Results"
            emptyDescription={`No favourites match "${debouncedQuery}".`}
            forceFavorite
          />
        </>
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
