import { PicsumImage } from '../types';

export const api = {
  async fetchPicsumImages(page: number, limit = 20): Promise<PicsumImage[]> {
    const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch images');
    return response.json();
  },
};
