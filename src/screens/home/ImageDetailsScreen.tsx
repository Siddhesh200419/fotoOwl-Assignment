import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { theme } from '../../theme/theme';
import { useTheme } from '../../hooks/useTheme';
import { useIsFavourite, useFavouritesStore } from '../../store/favoritesStore';
import { downloadImageToGallery, shareImageUrl } from '../../services/mediaDownload';
import { thumbUrl, fullUrl } from '../../utils/imageUrls';
import { hapticMedium, hapticSuccess, hapticTap } from '../../services/haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'ImageDetails'>;

const { width } = Dimensions.get('window');

export default function ImageDetailsScreen({ route, navigation }: Props) {
  const { image } = route.params;
  const { colors } = useTheme();
  const favourite = useIsFavourite(image.id);
  const toggleFavourite = useFavouritesStore((s) => s.toggleFavourite);

  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleDownload = async () => {
    hapticMedium();
    setDownloading(true);
    const result = await downloadImageToGallery(fullUrl(image.id), image.id);
    setDownloading(false);
    if (result.success) hapticSuccess();
    Alert.alert(result.success ? 'Saved!' : 'Download Failed', result.message);
  };

  const handleShare = async () => {
    hapticMedium();
    setSharing(true);
    const result = await shareImageUrl(fullUrl(image.id), image.id);
    setSharing(false);
    if (!result.success) {
      Alert.alert('Share Failed', result.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: fullUrl(image.id) }}
          placeholder={{ uri: thumbUrl(image.id) }}
          placeholderContentFit="contain"
          style={styles.image}
          contentFit="contain"
          transition={250}
          cachePolicy="memory-disk"
          recyclingKey={image.id}
          onLoad={() => setImageLoading(false)}
        />

        {imageLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading photo…</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            hapticTap();
            navigation.goBack();
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => {
            hapticMedium();
            toggleFavourite(image);
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name={favourite ? 'heart' : 'heart-outline'}
            size={22}
            color={favourite ? colors.heart : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.panel, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.panelContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.metaRow}>
          <View style={styles.authorContainer}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Photographer</Text>
            <Text style={[styles.authorText, { color: colors.text }]}>{image.author}</Text>
          </View>
          <View style={[styles.idBadge, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.idText, { color: colors.primary }]}>#{image.id}</Text>
          </View>
        </View>

        <View style={styles.dimensionsRow}>
          <Ionicons name="expand-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.dimensionsText, { color: colors.textSecondary }]}>
            {image.width} × {image.height} px
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.downloadButton, { backgroundColor: colors.primary }]}
            onPress={handleDownload}
            disabled={downloading}
            activeOpacity={0.8}
          >
            {downloading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="download-outline" size={20} color="#FFFFFF" />
            )}
            <Text style={styles.actionButtonText}>
              {downloading ? 'Saving…' : 'Save to Gallery'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
            onPress={handleShare}
            disabled={sharing}
            activeOpacity={0.8}
          >
            {sharing ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="share-outline" size={20} color={colors.primary} />
            )}
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              {sharing ? 'Sharing…' : 'Share'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const IMAGE_HEIGHT = width * 0.85;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  imageContainer: {
    width,
    height: IMAGE_HEIGHT,
    backgroundColor: '#111111',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: theme.borderRadius.full,
    padding: 8,
  },
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: theme.borderRadius.full,
    padding: 8,
  },
  panel: {
    flex: 1,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    marginTop: -theme.borderRadius.xl,
  },
  panelContent: {
    padding: theme.spacing.xl,
    paddingBottom: 40,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  authorContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  authorText: {
    fontSize: 20,
    fontWeight: '700',
  },
  idBadge: {
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.sm,
  },
  idText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dimensionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: theme.spacing.xl,
  },
  dimensionsText: {
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  downloadButton: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  shareButton: {
    borderWidth: 1.5,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
