import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { TrendingUp, TrendingDown, Wallet, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
    component: () => (
        <AppShell>
            <DashboardInner />
        </AppShell>
    ),
});

interface Txn {
    id: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
    status: "normal" | "high";
}

function DashboardInner() {
    const { user } = useAuth();
    const [txns, setTxns] = useState<Txn[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        async function fetchTxns() {
            try {
                const res = await fetch("http://localhost:5000/api/transactions", {
                    credentials: "include",
                });

                const data = await res.json();
                setTxns(data.transactions || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchTxns();
    }, [user]);

    const income = txns.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expense = txns.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const balance = income - expense;
    const high = txns.filter((t) => t.status === "high").length;

    // Monthly aggregation (last 6 months)
    const monthly = aggregateMonthly(txns);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your financial activity.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <StatCard label="Total Income" value={fmt(income)} icon={<TrendingUp className="h-4 w-4" />} tone="text-primary" />
                <StatCard label="Total Expenses" value={fmt(expense)} icon={<TrendingDown className="h-4 w-4" />} tone="text-warning" />
                <StatCard label="Balance" value={fmt(balance)} icon={<Wallet className="h-4 w-4" />} />
                <StatCard label="Transactions" value={String(txns.length)} icon={<AlertTriangle className="h-4 w-4" />} sub={`${high} high-value`} />
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6">
                <h2 className="text-lg font-semibold">Income vs Expenses</h2>
                <p className="text-xs text-muted-foreground">Last 6 months</p>
                <div className="mt-6 space-y-4">
                    {monthly.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
                    {monthly.map((m) => {
                        const max = Math.max(m.income, m.expense, 1);
                        return (
                            <div key={m.label}>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{m.label}</span>
                                    <span>
                                        <span className="text-primary">{fmt(m.income)}</span> /{" "}
                                        <span className="text-warning">{fmt(m.expense)}</span>
                                    </span>
                                </div>
                                <div className="mt-1 flex gap-1">
                                    <div className="h-3 rounded-l bg-emerald-gradient" style={{ width: `${(m.income / max) * 50}%` }} />
                                    <div className="h-3 rounded-r bg-warning/70" style={{ width: `${(m.expense / max) * 50}%` }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6">
                <h2 className="text-lg font-semibold">Recent transactions</h2>
                {loading ? (
                    <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
                ) : txns.length === 0 ? (
                    <p className="mt-4 text-sm text-muted-foreground">No transactions yet — add your first one!</p>
                ) : (
                    <ul className="mt-4 divide-y divide-border/60">
                        {txns.slice(0, 8).map((t) => (
                            <li key={t.id} className="flex items-center justify-between py-3 text-sm">
                                <div>
                                    <div className="font-medium">{t.category}</div>
                                    <div className="text-xs text-muted-foreground">{t.date}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {t.status === "high" && (
                                        <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-xs text-destructive">HIGH</span>
                                    )}
                                    <span className={t.type === "income" ? "font-semibold text-primary" : "font-semibold text-warning"}>
                                        {t.type === "income" ? "+" : "-"}
                                        {fmt(Number(t.amount))}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, tone, sub }: { label: string; value: string; icon: React.ReactNode; tone?: string; sub?: string }) {
    return (
        <div className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{label}</span>
                <span className="text-muted-foreground">{icon}</span>
            </div>
            <div className={`mt-2 text-2xl font-bold ${tone ?? ""}`}>{value}</div>
            {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
        </div>
    );
}

function fmt(n: number) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

function aggregateMonthly(txns: Txn[]) {
    const map = new Map<string, { label: string; income: number; expense: number }>();
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        map.set(key, { label: d.toLocaleString("en-US", { month: "short", year: "2-digit" }), income: 0, expense: 0 });
    }
    for (const t of txns) {
        const d = new Date(t.date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const e = map.get(key);
        if (!e) continue;
        if (t.type === "income") e.income += Number(t.amount);
        else e.expense += Number(t.amount);
    }
    return Array.from(map.values());
}
