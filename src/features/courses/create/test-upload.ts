import { uploadMedia } from "@/services/mediaService";

/**
 * Test script for video upload using the new simplified approach
 *
 * This script demonstrates how to use the MediaCMSService to upload a video
 * directly to our API, which will handle the upload to MediaCMS internally.
 *
 * Usage:
 * - Create a File object from a Blob or using the File constructor
 * - Call uploadVideo with the file, title, and description
 * - Handle the progress updates and result
 */
export async function testVideoUpload(file: File) {
  // Create Apollo client
  // const client = new ApolloClient({
  //   uri: "/graphql",
  //   cache: new InMemoryCache(),
  // });

  // Upload video with progress tracking
  try {
    const result = await uploadMedia(file, file.name.replace(/\.[^/.]+$/, ""), {
      onProgress: (progress: number) => {
        console.log(`Upload progress: ${progress.toFixed(2)}%`);
      },
    });

    console.log("Upload successful!", result);
    return result;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}
