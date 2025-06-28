import { NextRequest, NextResponse } from 'next/server';

// Configuration pour MediaCMS
// URL strictement sans slash à la fin comme exigé
const MEDIACMS_API_URL = 'http://localhost:9000/api/v1/media';
const MEDIACMS_USER_TOKEN_URL = 'http://localhost:9000/api/v1/user/token';

export async function POST(request: NextRequest) {
  console.log('Début du test de token MediaCMS');
  
  try {
    // Récupérer le token depuis le corps de la requête
    const body = await request.json();
    const { token } = body;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant dans la requête' },
        { status: 400 }
      );
    }
    
    console.log('Token reçu pour test:', token);
    
    // 1. Tester le token comme token d'authentification général
    console.log('Test du token comme token d\'authentification général');
    const authHeaders = {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json'
    };
    
    console.log('En-têtes d\'authentification:', authHeaders);
    
    // Tester l'accès à l'API MediaCMS avec ce token
    const authTestResponse = await fetch(MEDIACMS_API_URL, {
      method: 'GET',
      headers: authHeaders
    });
    
    console.log('Statut de la réponse (test auth):', authTestResponse.status);
    
    // 2. Essayer d'obtenir un token spécifique d'upload
    console.log('Tentative d\'obtention d\'un token spécifique d\'upload');
    const uploadTokenResponse = await fetch(MEDIACMS_USER_TOKEN_URL, {
      method: 'GET',
      headers: authHeaders
    });
    
    console.log('Statut de la réponse (token d\'upload):', uploadTokenResponse.status);
    
    let uploadToken = null;
    if (uploadTokenResponse.ok) {
      const tokensData = await uploadTokenResponse.json();
      console.log('Données des tokens d\'upload:', tokensData);
      
      if (Array.isArray(tokensData) && tokensData.length > 0) {
        uploadToken = tokensData[0].key;
        console.log('Token d\'upload trouvé:', uploadToken);
      }
    }
    
    // 3. Tester le token d'upload si on en a obtenu un
    let uploadTestResult = null;
    if (uploadToken) {
      console.log('Test du token spécifique d\'upload');
      const uploadHeaders = {
        'Authorization': `Token ${uploadToken}`,
        'X-CSRFTOKEN': uploadToken,
        'Accept': 'application/json'
      };
      
      console.log('En-têtes d\'upload:', uploadHeaders);
      
      const uploadTestResponse = await fetch(MEDIACMS_API_URL, {
        method: 'GET',
        headers: uploadHeaders
      });
      
      console.log('Statut de la réponse (test upload):', uploadTestResponse.status);
      uploadTestResult = {
        status: uploadTestResponse.status,
        ok: uploadTestResponse.ok
      };
    }
    
    // Retourner les résultats des tests
    return NextResponse.json({
      authTest: {
        status: authTestResponse.status,
        ok: authTestResponse.ok
      },
      uploadTokenTest: {
        status: uploadTokenResponse.status,
        ok: uploadTokenResponse.ok,
        token: uploadToken ? `${uploadToken.substring(0, 5)}...` : null
      },
      uploadTest: uploadTestResult
    });
    
  } catch (error) {
    console.error('Erreur lors du test du token:', error);
    return NextResponse.json(
      { error: `Test token error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
