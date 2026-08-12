import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export interface MediaActionResult {
  success: boolean;
  message: string;
}

export async function downloadImageToGallery(url: string, imageId: string): Promise<MediaActionResult> {
  const { status } = await MediaLibrary.requestPermissionsAsync(true);
  if (status !== 'granted') {
    return { success: false, message: 'Permission needed to save photos.' };
  }

  try {
    const file = await File.downloadFileAsync(
      url,
      new File(Paths.cache, `picsum_${imageId}.jpg`),
      { idempotent: true }
    );
    await MediaLibrary.saveToLibraryAsync(file.uri);
    return { success: true, message: 'Image saved to your gallery!' };
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, message: `Failed to save image. ${detail}` };
  }
}

export async function shareImageUrl(url: string, imageId: string): Promise<MediaActionResult> {
  if (!(await Sharing.isAvailableAsync())) {
    return { success: false, message: 'Sharing is not available on this device.' };
  }

  try {
    const file = await File.downloadFileAsync(
      url,
      new File(Paths.cache, `share_${imageId}.jpg`),
      { idempotent: true }
    );
    await Sharing.shareAsync(file.uri, {
      mimeType: 'image/jpeg',
      dialogTitle: 'Share photo',
      UTI: 'public.jpeg',
    });
    return { success: true, message: 'Share sheet opened.' };
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown error';
    if (/cancel|dismiss|abort/i.test(detail)) {
      return { success: true, message: 'Share cancelled.' };
    }
    return { success: false, message: `Failed to share image. ${detail}` };
  }
}
