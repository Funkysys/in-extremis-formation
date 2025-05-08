import { signIn } from "next-auth/react";
import { z } from "zod";
import { DEFAULT_STATE } from "./sendLink.type";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const sendLink = async (
  formState: DEFAULT_STATE,
  formData: FormData
) => {
  const validated = authSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validated.success) {
    return {
      success: "",
      error: validated.error.errors[0]?.message,
    } as DEFAULT_STATE;
  }

  try {
    await signIn("resend", {
      email: validated.data.email,
      redirect: false,
      callbackUrl: "/",
    });
    return {
      email: formState.email || "",
      password: formState.password || "",
      emailError: "",
      passwordError: "",
      loading: false,
      disabled: false,
      error: "",
      success: "Magic link sent! Check your email.",
    } as DEFAULT_STATE;
  } catch (error) {
    return {
      success: "",
      error: `Failed to send magic link. Please try again. ${error}`,
    } as DEFAULT_STATE;
  }
};
