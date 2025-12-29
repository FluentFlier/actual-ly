"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Activity,
  Bot,
  ChartLine,
  FileText,
  Home,
  MessageSquare,
  Rss,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";

const sections = [
  {
    label: "Dashboard",
    items: [
      { label: "Overview", href: "/dashboard", icon: Home },
      { label: "Feed", href: "/dashboard/feed", icon: Rss },
      { label: "Saved", href: "/dashboard/saved", icon: FileText },
      { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
      { label: "Invites", href: "/dashboard/invites", icon: Users },
    ],
  },
  {
    label: "Agent",
    items: [
      { label: "Chat", href: "/dashboard/agent", icon: Bot },
      { label: "Actions", href: "/dashboard/agent/actions", icon: Activity },
      { label: "Settings", href: "/dashboard/agent/settings", icon: Settings },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Analytics", href: "/dashboard/insights", icon: ChartLine },
      { label: "Trust Score", href: "/dashboard/insights/trust", icon: Shield },
      { label: "Network", href: "/dashboard/insights/network", icon: Users },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Profile", href: "/dashboard/settings/profile", icon: User },
      { label: "Integrations", href: "/dashboard/settings/integrations", icon: FileText },
    ],
  },
  {
    label: "Admin",
    items: [{ label: "Agent Logs", href: "/dashboard/admin/agent-logs", icon: Activity }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => setIsAdmin(Boolean(data?.isAdmin)))
      .catch(() => setIsAdmin(false));
  }, []);

  return (
    <aside className="hidden w-64 flex-col border-r border-border/60 bg-sidebar px-4 py-6 lg:flex">
      <div className="space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-3 py-4 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Actual.ly</p>
          <p className="mt-2 text-sm text-slate-200">Verified people. Automated follow‑ups.</p>
        </div>
        {sections
          .filter((section) => section.label !== "Admin" || isAdmin)
          .map((section) => (
          <div key={section.label} className="space-y-2">
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
