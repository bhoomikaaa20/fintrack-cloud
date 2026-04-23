import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, ShieldCheck, Receipt, Sparkles, FileDown, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-hero relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-32 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            High-value transaction monitoring built in
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Track every transaction
            <br />
            with <span className="text-gradient-emerald">clarity</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Ledgerly is a modern financial tracker for individuals and teams. Log income and expenses,
            attach receipts, monitor high-value activity, and export clean reports — all in one place.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/auth" search={{ mode: "signup" }}>
              <Button size="lg" className="bg-emerald-gradient text-primary-foreground shadow-glow hover:opacity-90">
                Start free <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline">Sign in</Button>
            </Link>
          </div>

          {/* Mock dashboard preview */}
          <div className="relative mx-auto mt-20 max-w-5xl">
            <div className="shadow-card-elevated rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur">
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  { label: "Income", val: "$48,200", tone: "text-primary" },
                  { label: "Expenses", val: "$12,540", tone: "text-warning" },
                  { label: "Balance", val: "$35,660", tone: "text-foreground" },
                  { label: "High value", val: "3 flagged", tone: "text-destructive" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-secondary/60 p-4 text-left">
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className={`mt-2 text-2xl font-semibold ${s.tone}`}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex h-32 items-end gap-2 rounded-xl bg-secondary/40 p-4">
                {[40, 65, 32, 80, 55, 90, 48, 72, 60, 85, 50, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-emerald-gradient opacity-80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold md:text-5xl">Everything you need, nothing you don't</h2>
          <p className="mt-4 text-muted-foreground">
            A focused toolkit for tracking, reporting, and oversight.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { icon: BarChart3, title: "Real-time dashboard", body: "Income, expenses, balance, and counts updated instantly." },
            { icon: ShieldCheck, title: "High-value alerts", body: "Anything over $50,000 is automatically flagged for review." },
            { icon: Receipt, title: "Cloud receipts", body: "Attach documents and receipts to any transaction." },
            { icon: FileDown, title: "CSV export", body: "Export filtered transactions for accounting & audits." },
            { icon: Users, title: "Admin oversight", body: "Admins can monitor users and high-value activity." },
            { icon: Sparkles, title: "Smart filters", body: "Filter by date, type, status, and category instantly." },
          ].map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border/60 bg-card/60 p-6 transition hover:border-primary/40 hover:bg-card"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-gradient text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-border/60 bg-card/30 py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold md:text-5xl">How it works</h2>
            <p className="mt-4 text-muted-foreground">Get from signup to insight in three steps.</p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { n: "01", t: "Create your account", d: "Sign up with email — your dashboard is ready instantly." },
              { n: "02", t: "Log your transactions", d: "Add income & expenses with category, date, and a receipt." },
              { n: "03", t: "Review & export", d: "See trends, flagged items, and export as CSV anytime." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-border/60 bg-background/50 p-8">
                <div className="text-gradient-emerald font-display text-4xl font-bold">{s.n}</div>
                <h3 className="mt-4 text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Benefits */}
      <section id="about" className="mx-auto grid max-w-7xl gap-12 px-6 py-28 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-4xl font-bold md:text-5xl">Built for the teams that care about every dollar</h2>
          <p className="mt-5 text-muted-foreground">
            Ledgerly combines a clean ledger with proactive monitoring. Whether you're tracking personal
            cashflow or overseeing a small finance ops team, you get a single source of truth — fast, secure, and beautiful.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Bank-grade security with row-level access control",
              "Automatic high-value transaction flagging",
              "Cloud-backed receipts with secure access",
              "Admin role with full system oversight"].map((b) => (
              <li key={b} className="flex items-start gap-3">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link to="/auth" search={{ mode: "signup" }}>
              <Button size="lg" className="bg-emerald-gradient text-primary-foreground shadow-glow hover:opacity-90">
                Create your account <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="shadow-card-elevated rounded-2xl border border-border/60 bg-card/70 p-8">
          <div className="space-y-4">
            {[
              { c: "Salary", a: "+12,500.00", t: "income" },
              { c: "Office rent", a: "-2,800.00", t: "expense" },
              { c: "Equipment", a: "-58,200.00", t: "high" },
              { c: "Consulting", a: "+9,400.00", t: "income" },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-secondary/60 p-4">
                <div>
                  <div className="font-medium">{r.c}</div>
                  <div className="text-xs text-muted-foreground">2025-04-{10 + i}</div>
                </div>
                <div className="flex items-center gap-3">
                  {r.t === "high" && (
                    <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-xs text-destructive">
                      HIGH
                    </span>
                  )}
                  <span
                    className={
                      r.t === "income"
                        ? "font-semibold text-primary"
                        : r.t === "high"
                          ? "font-semibold text-destructive"
                          : "font-semibold text-warning"
                    }
                  >
                    {r.a}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
