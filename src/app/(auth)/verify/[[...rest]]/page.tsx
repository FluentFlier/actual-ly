"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignInButton, SignUpButton, useAuth, useUser, UserProfile } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const USERNAME_REGEX = /^[a-z0-9_]{10,50}$/;

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();
  const [username, setUsername] = useState("");
  const [userHasUsername, setUserHasUsername] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const phoneVerified =
    user?.primaryPhoneNumber?.verification?.status === "verified";
  const emailVerified =
    user?.primaryEmailAddress?.verification?.status === "verified";

  const canContinue = phoneVerified && emailVerified && userHasUsername;

  const queryUsername = useMemo(
    () => searchParams.get("username")?.toLowerCase() || "",
    [searchParams],
  );

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUserHasUsername(Boolean(data?.user?.username)))
      .catch(() => setUserHasUsername(false));
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (!queryUsername || userHasUsername || !isSignedIn) return;

    fetch("/api/auth/claim-username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username: queryUsername }),
    }).then(() => setUserHasUsername(true));
  }, [queryUsername, userHasUsername]);

  async function handleClaim() {
    if (!isSignedIn) {
      setStatus("Please sign in first.");
      return;
    }
    if (!USERNAME_REGEX.test(username)) {
      setStatus("Invalid username format.");
      return;
    }

    const res = await fetch("/api/auth/claim-username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username }),
    });

    if (!res.ok) {
      const data = await res.json();
      setStatus(data?.error || "Unable to claim username.");
      return;
    }

    setUserHasUsername(true);
    setStatus(null);
  }

  async function handleContinue() {
    if (!isSignedIn) {
      setStatus("Please sign in first.");
      return;
    }
    setStatus("Syncing profile...");
    const res = await fetch("/api/auth/sync-profile", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      setStatus("Unable to sync profile.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="w-full space-y-6">
      {!isSignedIn ? (
        <Card>
          <CardHeader>
            <CardTitle>Sign in to verify</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Please sign in or create an account to claim your username and verify
              your phone + email.
            </p>
            <div className="flex flex-wrap gap-3">
              <SignInButton mode="modal">
                <Button>Sign in</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="outline">Create account</Button>
              </SignUpButton>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Verify your identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Actual.ly requires a verified phone number and email. Use the Clerk profile
            panel below to verify both.
          </p>
          <div className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3 text-sm">
            <span>Email verified</span>
            <span className={emailVerified ? "text-emerald-500" : "text-amber-500"}>
              {emailVerified ? "Verified" : "Pending"}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3 text-sm">
            <span>Phone verified</span>
            <span className={phoneVerified ? "text-emerald-500" : "text-amber-500"}>
              {phoneVerified ? "Verified" : "Pending"}
            </span>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-2">
            <UserProfile
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  cardBox: "w-full",
                  card: "shadow-none border-transparent bg-transparent p-0",
                  navbar: "hidden",
                  pageScrollBox: "max-h-[320px] overflow-y-auto",
                  headerTitle: "text-base",
                  headerSubtitle: "text-xs",
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {isSignedIn && !userHasUsername ? (
        <Card>
          <CardHeader>
            <CardTitle>Claim your username</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              This becomes your public profile: actual.ly/yourname
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={username}
                onChange={(event) => setUsername(event.target.value.trim().toLowerCase())}
                placeholder="your_username"
              />
              <Button onClick={handleClaim}>Claim</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Need help? You can also claim from the homepage.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Finish setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Once your phone and email are verified, sync your profile to unlock your
            dashboard and AI agent.
          </p>
          <Button onClick={handleContinue} disabled={!canContinue}>
            Sync & Continue
          </Button>
          {status ? <p className="text-xs text-muted-foreground">{status}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
