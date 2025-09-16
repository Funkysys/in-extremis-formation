export async function testUploadMultipart({
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
  // Vérification que le titre n'est pas vide
  if (!title || title.trim() === "") {
    return {
      errors: [{ message: "Le titre de la vidéo ne peut pas être vide" }],
    };
  }

  const operations = JSON.stringify({
    query: `
      mutation TestUpload($file: Upload!, $title: String!) {
        testUpload(file: $file, title: $title) {
          success
          fileSize
          filename
          title
          error
        }
      }
    `,
    variables: {
      file: null,
      title,
    },
  });

  console.log("Test upload operations:", operations);

  const map = JSON.stringify({ "0": ["variables.file"] });

  const formData = new FormData();
  formData.append("operations", operations);
  formData.append("map", map);
  formData.append("0", file);

  console.log("Sending test upload to:", endpoint);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  console.log("Test upload response status:", res.status);

  const responseText = await res.text();
  console.log("Test upload response text:", responseText);

  let result;
  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error(
      "Erreur lors du test d'upload : la réponse du serveur n'est pas au format JSON. Réponse brute : " +
        responseText
    );
  }
  return result;
}
