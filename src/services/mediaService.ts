import { VideoMetadata } from '@/types/video';
import { GET_UPLOAD_TOKEN_MUTATION, REGISTER_UPLOADED_VIDEO_MUTATION } from '@/graphql/mutations/mediaUpload';

interface UploadProgressCallback {
  onProgress?: (progress: number) => void;
  onSuccess?: (data: VideoMetadata) => void;
  onError?: (error: Error) => void;
}

export const uploadMedia = async (
  file: File,
  title?: string,
  callbacks?: UploadProgressCallback
): Promise<VideoMetadata> => {
  const finalTitle = title || file.name.replace(/\.[^/.]+$/, '');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  console.log('Token d\'authentification récupéré:', token ? 'Présent' : 'Absent');
  
  if (!token) {
    const error = new Error('Token d\'authentification manquant');
    callbacks?.onError?.(error);
    throw error;
  }

  try {
    console.log('Début de l\'upload média');
    // Étape 1: Récupérer le token d'upload MediaCMS
    console.log('Récupération du token MediaCMS...');
    const graphqlQuery = {
      query: GET_UPLOAD_TOKEN_MUTATION,
      variables: {}
    };
    console.log('Requête GraphQL:', JSON.stringify(graphqlQuery));
    const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: GET_UPLOAD_TOKEN_MUTATION.loc?.source.body,
        variables: {}
      })
    });

    const tokenData = await tokenResponse.json();
    console.log('Réponse token MediaCMS:', tokenData);
    if (!tokenData.data?.getMediacmsUploadToken?.token) {
      throw new Error('Impossible d\'obtenir le token d\'upload MediaCMS');
    }

    const mediaCmsToken = tokenData.data.getMediacmsUploadToken.token;
    const uploadUrl = tokenData.data.getMediacmsUploadToken.uploadUrl || 'http://localhost:9000/api/v1/media/';
    
    // Étape 2: Upload direct à MediaCMS
    return new Promise<VideoMetadata>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl);
      xhr.setRequestHeader('Authorization', `Token ${mediaCmsToken}`);
      xhr.timeout = 30 * 60 * 1000;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          callbacks?.onProgress?.(percentComplete);
        }
      };

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const mediaCmsResponse = JSON.parse(xhr.responseText);
            
            if (mediaCmsResponse.url) {
              // Étape 3: Enregistrer la vidéo dans notre API
              const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  query: REGISTER_UPLOADED_VIDEO_MUTATION,
                  variables: {
                    mediaCmsId: mediaCmsResponse.id,
                    title: finalTitle,
                    description: `Vidéo: ${finalTitle}`,
                    url: mediaCmsResponse.url,
                    thumbnailUrl: mediaCmsResponse.thumbnail_url || ''
                  }
                })
              });

              const registerData = await registerResponse.json();
              console.log('Réponse enregistrement vidéo:', registerData);
              
              if (registerData.data?.registerUploadedVideo?.video?.id) {
                const videoData = registerData.data.registerUploadedVideo.video;
                const videoMetadata: VideoMetadata = {
                  id: videoData.id,
                  title: videoData.title,
                  url: videoData.url,
                  thumbnailUrl: videoData.thumbnailUrl || '',
                  duration: videoData.duration || 0,
                  createdAt: videoData.createdAt || new Date().toISOString(),
                  updatedAt: videoData.updatedAt || new Date().toISOString()
                };
                
                callbacks?.onSuccess?.(videoMetadata);
                resolve(videoMetadata);
              } else {
                throw new Error('Erreur lors de l\'enregistrement de la vidéo');
              }
            } else {
              throw new Error('Réponse MediaCMS invalide');
            }
          } catch (error) {
            const parsedError = new Error(`Erreur lors du traitement de la réponse: ${error instanceof Error ? error.message : String(error)}`);
            callbacks?.onError?.(parsedError);
            reject(parsedError);
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            const error = new Error(`Erreur HTTP ${xhr.status}: ${JSON.stringify(errorData)}`);
            callbacks?.onError?.(error);
            reject(error);
          } catch {
            const error = new Error(`Erreur HTTP ${xhr.status}: ${xhr.statusText}`);
            callbacks?.onError?.(error);
            reject(error);
          }
        }
      };
      
      xhr.onerror = () => {
        const error = new Error('Erreur réseau lors de l\'upload');
        callbacks?.onError?.(error);
        reject(error);
      };
      
      xhr.ontimeout = () => {
        const error = new Error('Timeout lors de l\'upload');
        callbacks?.onError?.(error);
        reject(error);
      };

      const formData = new FormData();
      formData.append('media_file', file);
      formData.append('title', finalTitle);
      formData.append('description', `Vidéo: ${finalTitle}`);
      formData.append('encoding_status', 'pending');
      formData.append('state', 'private');
      
      xhr.send(formData);
    });
  } catch (error) {
    const parsedError = error instanceof Error ? error : new Error(String(error));
    callbacks?.onError?.(parsedError);
    throw parsedError;
  }
};
