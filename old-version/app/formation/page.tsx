"use client";

// import { auth } from "auth";
import { useSession } from "next-auth/react";

export default function ClientPage() {
  const { data: session, status } = useSession();
  //   const session = await auth();
  if (session && session?.user) {
    console.log("session.data.user", session.user);
  }

  return (
    <main>
      <h1>Formation</h1>
      <p>Session status: {status}</p>
      <p>Session: {JSON.stringify(session)}</p>
    </main>
  );
}
