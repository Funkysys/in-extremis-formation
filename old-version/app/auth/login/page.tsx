"use client";

import { sendLink } from "@/app/api/resend/sendlink";
import { DEFAULT_STATE } from "@/app/api/resend/sendLink.type";
import { useActionState, useTransition } from "react";

const DEFAULT_STATE_ACTION: DEFAULT_STATE = {
  success: "",
  error: "",
  email: "",
  password: "",
  loading: false,
  disabled: false,
  emailError: "",
  passwordError: "",
};

export default function LoginPage() {
  const initialState = {
    ...DEFAULT_STATE_ACTION,
  };
  const [state, formAction] = useActionState(sendLink, initialState);
  const [isPending, startTransition] = useTransition();

  const submitAction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      const formData = new FormData(event.currentTarget);
      formAction(formData);
    });
  };

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-md"
      onSubmit={submitAction}
    >
      <div className="flex flex-col gap-2">
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {state?.error && <p className="text-red-500">{state.error}</p>}
        {state?.success && <p className="text-green-500">{state.success}</p>}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        {isPending ? "Sending..." : "Send Magic Link"}
      </button>
    </form>
  );
}
