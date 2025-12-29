import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Bot, Shield, Sparkles } from "lucide-react";
import { UsernameClaim } from "@/components/features/username-claim";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "Verified Humans",
    description: "Phone + email verification keeps every account real and accountable.",
    icon: BadgeCheck,
  },
  {
    title: "Trust Scores",
    description: "Transparent credibility scores based on verification and network health.",
    icon: Shield,
  },
  {
    title: "AI Agent",
    description: "Your agent summarizes links, schedules reminders, and automates busywork.",
    icon: Bot,
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center lg:py-24">
        <div className="flex-1 space-y-6">
          <Badge variant="success" className="w-fit">
            Verified Humans Only
          </Badge>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            The social layer where every post is real and every person is verified.
          </h1>
          <p className="text-lg text-muted-foreground">
            Actual.ly combines phone-verified identity, transparent trust scores, and a powerful
            AI agent so your network is truthful, useful, and deeply human.
          </p>
          <UsernameClaim />
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> No bots. No spam. Real humans.
            </span>
            <span className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Trust score gated posting.
            </span>
          </div>
        </div>
        <div className="flex-1">
          <Card className="relative overflow-hidden bg-background sm:bg-gradient-to-br sm:from-white sm:via-white sm:to-emerald-50 dark:sm:from-card dark:sm:via-card dark:sm:to-emerald-950/20">
            <div className="absolute right-6 top-6 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Demo Snapshot
            </div>
            <CardHeader>
              <CardTitle>Actual.ly Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border bg-background/60 p-4">
                <p className="text-xs uppercase text-muted-foreground">Trust Score</p>
                <p className="text-2xl font-semibold">87 / 100</p>
                <div className="mt-3 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-[87%] rounded-full bg-primary" />
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background/60 p-4">
                <p className="text-xs uppercase text-muted-foreground">Agent Status</p>
                <p className="text-lg font-semibold">Active • 847 actions completed</p>
                <p className="text-sm text-muted-foreground">
                  "I saved three job links and scheduled a reminder for tomorrow."
                </p>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border bg-background/60 p-4 text-sm">
                <span>Recent network activity</span>
                <span className="font-semibold text-primary">+23 verified connections</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <Card className="flex flex-col items-start justify-between gap-6 bg-primary text-primary-foreground md:flex-row md:items-center">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to claim your actual identity?</CardTitle>
            <p className="text-sm text-primary-foreground/80">
              Phone and email verification unlocks your profile, trust score, and agent access.
            </p>
          </CardHeader>
          <CardContent className="pt-0 md:pt-6">
            <Button asChild variant="secondary" size="lg" className="text-primary">
              <Link href="/sign-up" className="flex items-center gap-2">
                Start now <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
