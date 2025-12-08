import {
  CREATE_VIDEO_MUTATION,
  DELETE_VIDEO_MUTATION,
  MODERATE_VIDEO_MUTATION,
  SET_VIDEO_PREMIUM_MUTATION,
  UPDATE_VIDEO_MUTATION,
} from "@/graphql/mutations";
import { useMutation } from "@apollo/client";

export function useVideoMutations() {
  const [createVideo, { loading: creating }] = useMutation(
    CREATE_VIDEO_MUTATION
  );
  const [updateVideo, { loading: updating }] = useMutation(
    UPDATE_VIDEO_MUTATION
  );
  const [deleteVideo, { loading: deleting }] = useMutation(
    DELETE_VIDEO_MUTATION
  );
  const [moderateVideo, { loading: moderating }] = useMutation(
    MODERATE_VIDEO_MUTATION
  );
  const [setVideoPremium, { loading: settingPremium }] = useMutation(
    SET_VIDEO_PREMIUM_MUTATION
  );

  return {
    createVideo,
    updateVideo,
    deleteVideo,
    moderateVideo,
    setVideoPremium,
    loading: creating || updating || deleting || moderating || settingPremium,
  };
}
