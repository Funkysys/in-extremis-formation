import { UPLOAD_VIDEO_MUTATION } from "@/graphql/mutations/video-mutations";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export const uploadVideoFile = async (
  client: ApolloClient<NormalizedCacheObject>,
  file: File,
  title: string
) => {
  try {
    const result = await client.mutate({
      mutation: UPLOAD_VIDEO_MUTATION,
      variables: {
        file,
        title,
      },
      context: {
        headers: {
          'apollo-require-preflight': 'true',
        },
      },
    });

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.uploadVideo;
  } catch (error) {
    console.error('Erreur lors de l\'upload de la vidéo:', error);
    throw error;
  }
};
