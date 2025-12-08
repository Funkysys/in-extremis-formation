import { useState } from "react";
import {
  useAllVideos,
  useMyVideos,
  usePremiumVideos,
  usePublicVideos,
} from "./useVideos";

type VideoType = "public" | "premium" | "my" | "all";

export function useVideosPagination(type: VideoType = "public") {
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  const queryMap = {
    public: usePublicVideos,
    premium: usePremiumVideos,
    my: useMyVideos,
    all: useAllVideos,
  };

  const { data, loading, error, refetch, fetchMore } = queryMap[type](
    limit,
    offset
  );

  const loadMore = () => {
    setOffset((prev) => prev + limit);
    fetchMore({
      variables: {
        limit,
        offset: offset + limit,
      },
    });
  };

  const reset = () => {
    setOffset(0);
    refetch({ limit, offset: 0 });
  };

  return {
    videos: data?.[`${type}Videos`] || [],
    loading,
    error,
    loadMore,
    reset,
    hasMore: data?.[`${type}Videos`]?.length === limit,
  };
}
