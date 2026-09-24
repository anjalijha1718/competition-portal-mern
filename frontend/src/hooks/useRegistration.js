import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registrationAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const useRegistration = (competitionId, slug) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Registration Mutation with Optimistic Updates & Idempotency Key
  const registerMutation = useMutation({
    mutationFn: async ({ amountPaid = 99, idempotencyKey = null }) => {
      // Generate a unique idempotency key if not explicitly supplied
      const key =
        idempotencyKey ||
        `feedants_idem_${competitionId}_${user?.id || 'anon'}_${Math.random().toString(36).substring(2, 9)}`;

      const res = await registrationAPI.register(competitionId, { amountPaid }, key);
      return res.data;
    },
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['competition', slug] });

      // Snapshot previous value
      const previousCompetitionData = queryClient.getQueryData(['competition', slug, user?._id || 'guest', null]);

      // Optimistically update cache
      if (previousCompetitionData) {
        queryClient.setQueryData(['competition', slug, user?._id || 'guest', null], (old) => {
          if (!old) return old;
          return {
            ...old,
            slotsRemaining: Math.max(0, old.slotsRemaining - 1),
            competition: {
              ...old.competition,
              bookedSlots: (old.competition.bookedSlots || 0) + 1,
            },
            userRegistrationState: {
              isRegistered: true,
              status: 'registered',
              paymentStatus: 'paid',
              registeredAt: new Date().toISOString(),
            },
          };
        });
      }

      return { previousCompetitionData };
    },
    onError: (err, variables, context) => {
      // Rollback to previous state on error
      if (context?.previousCompetitionData) {
        queryClient.setQueryData(
          ['competition', slug, user?._id || 'guest', null],
          context.previousCompetitionData
        );
      }
    },
    onSettled: () => {
      // Invalidate to fetch fresh authoritative state from backend
      queryClient.invalidateQueries({ queryKey: ['competition', slug] });
    },
  });

  // Entry submission mutation
  const submitMutation = useMutation({
    mutationFn: async ({ submissionUrl }) => {
      const res = await registrationAPI.submitEntry(competitionId, submissionUrl);
      return res.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['competition', slug] });
    },
  });

  return {
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    submitEntry: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    submitError: submitMutation.error,
  };
};
