// Hook pour la modération des vidéos

import {
  DELETE_VIDEO_MUTATION,
  MODERATE_VIDEO_MUTATION,
  SET_VIDEO_PREMIUM_MUTATION,
  UPDATE_VIDEO_MUTATION,
} from "@/graphql/mutations/video-mutations";
import { ALL_VIDEOS_QUERY } from "@/graphql/queries/video-queries";
import { QUERY_LIMITS } from "@/lib/admin/constants";
import { AdminVideo, VideoFilterStatus } from "@/lib/admin/types";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

export const useVideosModeration = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<VideoFilterStatus>("all");

  const { data, loading, refetch } = useQuery(ALL_VIDEOS_QUERY, {
    variables: { limit: QUERY_LIMITS.default, offset: QUERY_LIMITS.offset },
  });

  const [updateVideo] = useMutation(UPDATE_VIDEO_MUTATION, {
    onCompleted: () => refetch(),
  });

  const [deleteVideo] = useMutation(DELETE_VIDEO_MUTATION, {
    onCompleted: () => refetch(),
  });

  const [moderateVideo] = useMutation(MODERATE_VIDEO_MUTATION, {
    onCompleted: () => refetch(),
  });

  const [setVideoPremium] = useMutation(SET_VIDEO_PREMIUM_MUTATION, {
    onCompleted: () => refetch(),
  });

  const videos: AdminVideo[] = data?.allVideos || [];

  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "published" && v.is_published) ||
      (filterStatus === "unpublished" && !v.is_published) ||
      (filterStatus === "premium" && v.is_premium);

    return matchesSearch && matchesFilter;
  });

  const handleTogglePublish = async (
    videoId: string,
    currentStatus: boolean
  ) => {
    await updateVideo({
      variables: {
        id: parseInt(videoId),
        input: { is_published: !currentStatus },
      },
    });
  };

  const handleTogglePremium = async (
    videoId: string,
    currentStatus: boolean
  ) => {
    await setVideoPremium({
      variables: {
        id: parseInt(videoId),
        is_premium: !currentStatus,
      },
    });
  };

  const handleApprove = async (videoId: string) => {
    await moderateVideo({
      variables: {
        id: parseInt(videoId),
        status: "approved",
      },
    });
  };

  const handleDelete = async (videoId: string, title: string) => {
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer la vidéo "${title}" ? Cette action est irréversible.`
      )
    ) {
      await deleteVideo({
        variables: { id: parseInt(videoId) },
      });
    }
  };

  return {
    videos,
    filteredVideos,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    handleTogglePublish,
    handleTogglePremium,
    handleApprove,
    handleDelete,
  };
};
