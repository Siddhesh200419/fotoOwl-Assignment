import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export interface DownloadResult {
  success: boolean;
  message: string;
}

/**
 * Returns a writable directory for temporary cache files.
 * Handles Expo SDK version differences defensively.
 */
function getCacheDir(): string {
  const fs = FileSystem as unknown as {
    cacheDirectory?: string;
    documentDirectory?: string;
  };
  const dir = fs.cacheDirectory ?? fs.documentDirectory;
  if (!dir) {
    throw new Error('No writable cache directory available on this device.');
  }
  return dir;
}

/**
 * Downloads a remote image to the device gallery.
 * Requests MEDIA_LIBRARY permission first; explains why if denied.
 */
export async function downloadImageToGallery(
  url: string,
  imageId: string
): Promise<DownloadResult> {
  const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();

  if (status !== 'granted') {
    return {
      success: false,
      message: canAskAgain
        ? 'Media library permission is required to save images. Please allow it.'
        : 'Permission denied. Go to Settings → FotoOwl → Photos and enable access.',
    };
  }

  const localUri = `${getCacheDir()}picsum_${imageId}.jpg`;

  try {
    const { status: dlStatus } = await FileSystem.downloadAsync(url, localUri);
    if (dlStatus !== 200) {
      return { success: false, message: 'Download failed. Please check your connection.' };
    }
  } catch {
    return { success: false, message: 'Download failed. Please check your connection.' };
  }

  try {
    await MediaLibrary.saveToLibraryAsync(localUri);
    return { success: true, message: 'Image saved to your gallery!' };
  } catch {
    return { success: false, message: 'Failed to save image to gallery.' };
  }
}

/**
 * Shares a URL string using the OS share sheet.
 */
export async function shareImageUrl(url: string): Promise<void> {
  const available = await Sharing.isAvailableAsync();
  if (!available) return;

  const localUri = `${getCacheDir()}share_temp.jpg`;
  try {
    await FileSystem.downloadAsync(url, localUri);
    await Sharing.shareAsync(localUri, { mimeType: 'image/jpeg' });
  } catch {
    // Silently fail — share is a bonus feature
  }
}
