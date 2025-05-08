import { EmailTemplate } from "@/components/EmailTemplate";
import getResend from "./resend";

interface VerificationRequestParams {
  identifier: string;
  provider: {
    from: string;
  };
  url: string;
}

export async function sendVerificationRequest(
  params: VerificationRequestParams
) {
  const resend = getResend();

  const { url } = params;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "default@example.com",
      to: ["delivered@resend.dev"],
      subject: "Hello World",
      react: EmailTemplate({ magicLink: url }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }
    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
