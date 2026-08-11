import { PicsumImage } from '../types';

export const api = {
  /**
   * Fetch a list of images from Picsum Photos API
   */
  async fetchPicsumImages(page: number, limit = 20): Promise<PicsumImage[]> {
    try {
      const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch images from Picsum API');
      }
      return (await response.json()) as PicsumImage[];
    } catch (error) {
      console.error(`Error fetching images on page ${page}:`, error);
      throw error;
    }
  },
};
