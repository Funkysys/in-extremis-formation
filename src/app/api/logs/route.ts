// API Route: /api/logs - Endpoint pour recevoir les logs

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const log = await request.json();

    // En production, envoyer vers un service de logging (Sentry, LogRocket, etc.)
    console.log("[CLIENT LOG]", log);

    // TODO: Intégrer avec un service de logging externe
    // await sendToSentry(log);
    // await sendToLogRocket(log);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing log:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
