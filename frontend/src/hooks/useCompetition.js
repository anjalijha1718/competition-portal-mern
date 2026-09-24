import { useQuery } from '@tanstack/react-query';
import { competitionAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const useCompetition = (slug, overrideNow = null) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['competition', slug, user?._id || 'guest', overrideNow],
    queryFn: async () => {
      const res = await competitionAPI.getBySlug(slug, overrideNow);
      return res.data;
    },
    enabled: !!slug,
    refetchOnWindowFocus: true,
    staleTime: 5000, // 5 seconds
  });
};
