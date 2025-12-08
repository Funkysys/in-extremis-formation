// Hook: useOptimisticMutation - Hook pour mutations optimistes Apollo

import { logger } from "@/services/logger";
import {
  useMutation,
  type MutationHookOptions,
  type MutationTuple,
} from "@apollo/client";
import { DocumentNode } from "graphql";

interface OptimisticConfig<TData, TVariables> {
  mutation: DocumentNode;
  options?: MutationHookOptions<TData, TVariables>;
  optimisticResponse: (variables: TVariables) => TData;
  updateCache?: (cache: unknown, result: { data?: TData }) => void;
  onError?: (error: Error) => void;
  onSuccess?: (data: TData) => void;
}

export function useOptimisticMutation<TData = unknown, TVariables = unknown>(
  config: OptimisticConfig<TData, TVariables>
): MutationTuple<TData, TVariables> {
  const {
    mutation,
    options,
    optimisticResponse,
    updateCache,
    onError,
    onSuccess,
  } = config;

  const [mutate, result] = useMutation<TData, TVariables>(mutation, {
    ...options,
    optimisticResponse: optimisticResponse as never,
    update: (cache, mutationResult) => {
      if (updateCache && mutationResult.data) {
        logger.debug("Updating Apollo cache", "useOptimisticMutation");
        updateCache(cache as unknown, { data: mutationResult.data as TData });
      }
    },
    onCompleted: (data) => {
      logger.info("Mutation completed successfully", "useOptimisticMutation");
      if (onSuccess) {
        onSuccess(data);
      }
      if (options?.onCompleted) {
        options.onCompleted(data);
      }
    },
    onError: (error) => {
      logger.error(
        "Mutation failed, reverting optimistic update",
        error,
        "useOptimisticMutation"
      );
      if (onError) {
        onError(error);
      }
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  return [mutate, result];
}
