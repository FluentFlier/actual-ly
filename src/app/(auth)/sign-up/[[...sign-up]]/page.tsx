import { SignUp } from "@clerk/nextjs";

type SignUpPageProps = {
  searchParams: Promise<{ username?: string }> | { username?: string };
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const resolved = await Promise.resolve(searchParams);
  const redirectUrl = resolved?.username
    ? `/verify?username=${encodeURIComponent(resolved.username)}`
    : "/verify";

  return (
    <SignUp
      appearance={{
        elements: {
          card: "shadow-xl border border-border rounded-2xl",
        },
      }}
      redirectUrl={redirectUrl}
      afterSignUpUrl={redirectUrl}
    />
  );
}
