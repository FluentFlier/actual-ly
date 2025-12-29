import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          card: "shadow-xl border border-border rounded-2xl",
        },
      }}
      redirectUrl="/verify"
      afterSignInUrl="/verify"
    />
  );
}
