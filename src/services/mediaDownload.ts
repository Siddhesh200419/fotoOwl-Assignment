import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export interface MediaActionResult {
  success: boolean;
  message: string;
}

async function downloadToCache(url: string, filename: string): Promise<File> {
  const destination = new File(Paths.cache, filename);
  return File.downloadFileAsync(url, destination, { idempotent: true });
}

/**
 * Downloads a remote image to the device gallery.
 * Requests media-library permission first; explains why if denied.
 */
export async function downloadImageToGallery(
  url: string,
  imageId: string
): Promise<MediaActionResult> {
  const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync(true);

  if (status !== 'granted') {
    return {
      success: false,
      message: canAskAgain
        ? 'Media library permission is required to save images. Please allow it.'
        : 'Permission denied. Go to Settings → FotoOwl → Photos and enable access.',
    };
  }

  try {
    const file = await downloadToCache(url, `picsum_${imageId}.jpg`);
    await MediaLibrary.saveToLibraryAsync(file.uri);
    return { success: true, message: 'Image saved to your gallery!' };
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, message: `Failed to save image. ${detail}` };
  }
}

/**
 * Downloads the image locally, then opens the OS share sheet.
 */
export async function shareImageUrl(url: string, imageId: string): Promise<MediaActionResult> {
  const available = await Sharing.isAvailableAsync();
  if (!available) {
    return { success: false, message: 'Sharing is not available on this device.' };
  }

  try {
    const file = await downloadToCache(url, `share_${imageId}.jpg`);
    await Sharing.shareAsync(file.uri, {
      mimeType: 'image/jpeg',
      dialogTitle: 'Share photo',
      UTI: 'public.jpeg',
    });
    return { success: true, message: 'Share sheet opened.' };
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown error';
    // User dismissed the share sheet — not a real failure.
    if (/cancel|dismiss|abort/i.test(detail)) {
      return { success: true, message: 'Share cancelled.' };
    }
    return { success: false, message: `Failed to share image. ${detail}` };
  }
}
