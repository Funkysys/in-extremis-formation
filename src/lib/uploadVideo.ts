export async function uploadVideoMultipart({
  endpoint,
  file,
  title,
  token,
}: {
  endpoint: string;
  file: File;
  title: string;
  token?: string;
}) {
  if (!title || title.trim() === "") {
    return {
      errors: [{ message: "Le titre de la vidéo ne peut pas être vide" }],
    };
  }

  console.log("Utilisation de l'endpoint REST pour l'upload");
  console.log("Fichier:", {
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: new Date(file.lastModified).toISOString(),
  });
  console.log("Titre:", title);

  const restEndpoint = endpoint.replace(
    "/graphql",
    "/api/uploads/upload-video"
  );
  console.log("REST endpoint:", restEndpoint);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);

  const res = await fetch(restEndpoint, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    try {
      const errorJson = JSON.parse(errorText);
      return {
        errors: [{ message: errorJson.detail || "Une erreur est survenue" }],
      };
    } catch {
      return {
        errors: [{ message: errorText || "Une erreur est survenue" }],
      };
    }
  }

  const responseText = await res.text();
  console.log("Réponse brute du serveur:", responseText);

  let result;
  try {
    result = JSON.parse(responseText);
    console.log("Réponse JSON parsée:", result);

    if (result.success && result.video) {
      console.log("Vidéo reçue du serveur:", result.video);

      const video = {
        id: result.video.id,
        title: result.video.title,
        url: result.video.url,
        thumbnailUrl: result.video.thumbnailUrl, // Attention au camelCase ici
        createdAt: result.video.createdAt,
        updatedAt: result.video.updatedAt,
      };

      const graphqlResponse = {
        data: {
          uploadVideo: {
            video: video,
            error: null,
          },
        },
      };

      console.log("Réponse formatée pour GraphQL:", graphqlResponse);
      return graphqlResponse;
    } else if (result.error) {
      console.log("Erreur reçue du serveur:", result.error);

      const errorResponse = {
        data: {
          uploadVideo: {
            video: null,
            error: result.error,
          },
        },
      };

      console.log("Erreur formatée pour GraphQL:", errorResponse);
      return errorResponse;
    } else {
      console.log("Réponse inattendue du serveur:", result);
    }
  } catch {
    throw new Error(
      "La réponse du serveur n'est pas au format JSON. Réponse brute : " +
        responseText
    );
  }
  return result;
}
