import { NextRequest, NextResponse } from "next/server";

// Configuration pour MediaCMS
// URL strictement sans slash à la fin comme exigé
const MEDIACMS_API_URL = "http://localhost:9000/api/v1/media";
const MEDIACMS_USER_TOKEN_URL = "http://localhost:9000/api/v1/user/token";

export async function POST(request: NextRequest) {
  console.log("Début de traitement de la requête upload-video-simple");

  try {
    console.log(
      "En-têtes reçus:",
      Object.fromEntries(request.headers.entries())
    );

    // Récupérer les cookies pour l'authentification MediaCMS
    const cookieHeader = request.headers.get("cookie");
    console.log("Cookies reçus:", cookieHeader);

    // Extraire les cookies MediaCMS si présents
    let csrftoken = "";
    let sessionid = "";

    if (cookieHeader) {
      const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
      cookies.forEach((cookie) => {
        const [name, value] = cookie.split("=");
        if (name === "csrftoken") csrftoken = value;
        if (name === "sessionid") sessionid = value;
      });
    }

    console.log(
      "Cookies extraits - csrftoken:",
      csrftoken,
      "sessionid:",
      sessionid
    );

    // Vérifier l'authentification via header Authorization
    const authHeader = request.headers.get("authorization");
    let token = "";

    if (authHeader) {
      console.log("En-tête d'autorisation trouvé:", authHeader);
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else if (authHeader.startsWith("Token ")) {
        token = authHeader.split(" ")[1];
      } else {
        token = authHeader; // Prendre le header tel quel
      }
    }

    // Si pas de token dans le header, essayer de le récupérer des cookies
    if (!token && sessionid) {
      console.log("Utilisation du sessionid comme token");
      token = sessionid;
    }

    if (!token) {
      console.error("Erreur d'authentification: Aucun token trouvé");
      return NextResponse.json(
        {
          error: "Authentication required",
          details: "No token found in headers or cookies",
        },
        { status: 401 }
      );
    }

    console.log("Token d'authentification trouvé");

    // Pour le développement, on peut désactiver temporairement la vérification d'authentification
    // Décommentez la ligne suivante pour ignorer l'authentification en développement
    // const token = 'development_token';

    // Vérifier que la requête est un formulaire multipart
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      console.error("Erreur de format: Ce n'est pas un formulaire multipart");
      return NextResponse.json(
        { error: "Request must be multipart/form-data" },
        { status: 400 }
      );
    }

    console.log("Extraction des données du formulaire");
    const formData = await request.formData();

    // Extraire le fichier et les métadonnées
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    // Récupérer le token d'upload MediaCMS et l'URL d'upload
    const uploadTokenFromFrontend = formData.get("uploadToken") as string;
    const uploadUrlFromFrontend = (formData.get("uploadUrl") as string) || "";

    console.log(
      "TOKEN REÇU DU FRONTEND (uploadToken):",
      uploadTokenFromFrontend
    );
    console.log("URL D'UPLOAD REÇUE DU FRONTEND:", uploadUrlFromFrontend);

    // Construire l'URL d'upload avec le friendly-token
    let uploadUrl: string;
    if (uploadUrlFromFrontend) {
      // Utiliser l'URL complète fournie par le frontend
      uploadUrl = uploadUrlFromFrontend;
    } else if (uploadTokenFromFrontend) {
      // Construire l'URL avec le token si elle n'est pas fournie
      uploadUrl = `${MEDIACMS_API_URL}/${uploadTokenFromFrontend}`;
    } else {
      console.error("Erreur: Aucun token d'upload fourni");
      return NextResponse.json(
        { error: "No upload token provided" },
        { status: 400 }
      );
    }

    console.log("URL d'upload finale avec friendly-token:", uploadUrl);

    if (!file) {
      console.error("Erreur de données: Fichier manquant");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log(`Fichier reçu: ${file.name}, taille: ${file.size} bytes`);

    // Créer un nouveau FormData pour MediaCMS
    const mediaCmsFormData = new FormData();

    // IMPORTANT: Le nom du champ doit être 'media_file' pour MediaCMS
    mediaCmsFormData.append("media_file", file);
    mediaCmsFormData.append("title", title || file.name);
    mediaCmsFormData.append("description", description || "");

    console.log("Envoi du fichier à MediaCMS");

    // Préparation du token pour MediaCMS
    // Utiliser le token fourni par le frontend ou fallback sur le token d'authentification
    let finalUploadToken = uploadTokenFromFrontend || token;

    // Nettoyer le token comme dans le code Python
    // Supprimer tout préfixe 'Token ' ou 'Bearer ' s'il existe
    if (finalUploadToken.startsWith("Token ")) {
      finalUploadToken = finalUploadToken.substring(6);
    } else if (finalUploadToken.startsWith("Bearer ")) {
      finalUploadToken = finalUploadToken.substring(7);
    }

    // Supprimer tous les caractères non alphanumériques comme dans le code Python
    finalUploadToken = finalUploadToken.replace(/[^\w\d]/g, "").trim();
    console.log("Token nettoyé:", finalUploadToken);

    // Si le token du frontend n'est pas disponible, essayer d'en obtenir un nouveau
    if (!uploadTokenFromFrontend) {
      try {
        console.log(
          "Tentative de récupération d'un token spécifique d'upload..."
        );
        const tokenResponse = await fetch(MEDIACMS_USER_TOKEN_URL, {
          method: "GET",
          headers: {
            Authorization: `Token ${finalUploadToken}`,
            Accept: "application/json",
          },
        });

        if (tokenResponse.ok) {
          const tokensData = await tokenResponse.json();
          console.log("Réponse tokens:", tokensData);

          // Les tokens sont généralement retournés dans une liste
          if (Array.isArray(tokensData) && tokensData.length > 0) {
            // Prendre le premier token disponible
            const tokenFromResponse = tokensData[0]?.key;
            if (tokenFromResponse) {
              console.log("Token spécifique d'upload récupéré avec succès");
              finalUploadToken = tokenFromResponse;
            } else {
              console.error("Aucun token d'upload trouvé dans la réponse");
            }
          } else {
            console.error(
              "Format de réponse inattendu ou liste de tokens vide"
            );
          }
        } else {
          const errorText = await tokenResponse.text();
          console.error(
            `Erreur lors de la récupération du token d'upload: ${tokenResponse.status} - ${errorText}`
          );
        }
      } catch (error) {
        console.error(
          "Exception lors de la récupération du token d'upload:",
          error
        );
      }
    }

    console.log("TOKEN FINAL POUR MEDIACMS:", finalUploadToken);
    console.log("Envoi du fichier à MediaCMS avec token spécifique d'upload");

    // Log complet de la requête MediaCMS
    console.log("URL MediaCMS:", MEDIACMS_API_URL);
    console.log("En-têtes MediaCMS:", {
      Authorization: `Token ${finalUploadToken}`,
      "X-CSRFTOKEN": finalUploadToken,
    });

    // IMPORTANT: Ajouter un log pour vérifier le nom du champ de fichier
    console.log("Nom du champ de fichier:", "media_file");

    // Logs détaillés du FormData
    console.log("===== DÉTAILS DU FORMDATA =====");
    // Utiliser Array.from pour éviter les problèmes d'itération avec FormData
    Array.from(mediaCmsFormData.entries()).forEach(([key, value]) => {
      if (value instanceof File) {
        console.log(
          `${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`
        );
      } else {
        console.log(`${key}: ${value}`);
      }
    });
    console.log("==============================");

    // Récupérer le token d'authentification depuis l'en-tête ou le formulaire
    // const authToken = finalUploadToken;

    // Envoyer la requête avec l'URL construite contenant le friendly-token
    console.log("Envoi de la requête à MediaCMS avec l'URL:", uploadUrl);
    const mediaCmsResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Token ${finalUploadToken}`,
        "X-CSRFTOKEN": finalUploadToken,
      },
      body: mediaCmsFormData,
    });

    // Logs détaillés de la réponse MediaCMS
    console.log("===== RÉPONSE MEDIACMS =====");
    console.log("Status:", mediaCmsResponse.status);
    console.log("Status Text:", mediaCmsResponse.statusText);
    console.log(
      "Headers:",
      Object.fromEntries(mediaCmsResponse.headers.entries())
    );

    // Capturer le texte de la réponse pour analyse
    const responseText = await mediaCmsResponse.text();
    console.log("Response Text:", responseText);
    console.log("===========================");

    // Traiter la réponse selon le statut
    if (!mediaCmsResponse.ok) {
      console.error(
        `Erreur MediaCMS: ${mediaCmsResponse.status} - ${responseText}`
      );

      // Analyser l'erreur pour fournir plus de détails
      let errorDetails = responseText;
      try {
        const errorJson = JSON.parse(responseText);
        errorDetails = JSON.stringify(errorJson, null, 2);
        console.log("Erreur JSON analysée:", errorJson);
      } catch {
        console.log("La réponse d'erreur n'est pas du JSON valide");
      }

      return NextResponse.json(
        {
          error: `MediaCMS upload failed: ${mediaCmsResponse.statusText}`,
          details: errorDetails,
          status: mediaCmsResponse.status,
        },
        { status: mediaCmsResponse.status }
      );
    }

    // Essayer de parser la réponse comme JSON
    let mediaCmsData;
    try {
      mediaCmsData = JSON.parse(responseText);
      console.log("Réponse MediaCMS (JSON):", mediaCmsData);
    } catch (e) {
      console.error("Impossible de parser la réponse MediaCMS comme JSON:", e);
      return NextResponse.json(
        { error: "Invalid MediaCMS response format" },
        { status: 500 }
      );
    }

    // Extraire l'ID et l'URL de la vidéo
    // Selon la documentation Swagger, l'ID est dans friendly_token
    const mediaCmsId =
      mediaCmsData.friendly_token || mediaCmsData.url?.split("/").pop();
    const videoUrl =
      mediaCmsData.url || `http://localhost:9000/api/v1/media/${mediaCmsId}/`;
    const thumbnailUrl =
      mediaCmsData.thumbnail_url ||
      `http://localhost:9000/api/v1/media/${mediaCmsId}/thumbnail/`;

    if (!mediaCmsId) {
      console.error("Erreur de réponse: ID MediaCMS manquant");
      return NextResponse.json(
        { error: "Invalid MediaCMS response" },
        { status: 500 }
      );
    }

    // Enregistrer les métadonnées dans notre base de données via GraphQL
    const graphqlEndpoint =
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
      "http://localhost:8000/graphql";

    const graphqlMutation = `
      mutation RegisterUploadedVideo($mediaCmsId: String!, $title: String!, $description: String!, $url: String!, $thumbnailUrl: String!) {
        registerUploadedVideo(mediaCmsId: $mediaCmsId, title: $title, description: $description, url: $url, thumbnailUrl: $thumbnailUrl) {
          video {
            id
            title
            description
            url
            thumbnailUrl
            duration
          }
        }
      }
    `;

    console.log("Enregistrement des métadonnées via GraphQL");

    const graphqlResponse = await fetch(graphqlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: graphqlMutation,
        variables: {
          mediaCmsId,
          title,
          description,
          url: videoUrl,
          thumbnailUrl,
        },
      }),
    });

    const graphqlData = await graphqlResponse.json();
    console.log("Réponse GraphQL:", graphqlData);

    if (graphqlData.errors) {
      console.error("Erreur GraphQL:", graphqlData.errors);
      return NextResponse.json(
        { error: `GraphQL error: ${graphqlData.errors[0].message}` },
        { status: 500 }
      );
    }

    const videoData = graphqlData.data?.registerUploadedVideo?.video;
    if (!videoData) {
      console.error("Erreur de données: Métadonnées vidéo manquantes");
      return NextResponse.json(
        { error: "Failed to register video metadata" },
        { status: 500 }
      );
    }

    console.log("Upload vidéo réussi");

    // Retourner les métadonnées de la vidéo
    return NextResponse.json({
      success: true,
      video: {
        id: videoData.id,
        title: videoData.title,
        description: videoData.description,
        url: videoData.url,
        thumbnailUrl: videoData.thumbnailUrl,
        duration: videoData.duration || 0,
      },
    });
  } catch (error) {
    console.error("Erreur lors du traitement de l'upload:", error);
    return NextResponse.json(
      {
        error: `Upload processing error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
