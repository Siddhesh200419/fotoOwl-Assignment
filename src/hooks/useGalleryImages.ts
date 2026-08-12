import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useGalleryImages(limit = 20) {
  return useInfiniteQuery({
    queryKey: ['gallery-images'],
    queryFn: ({ pageParam = 1 }) => api.fetchPicsumImages(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length + 1;
    },
  });
}
