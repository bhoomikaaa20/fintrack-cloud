import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin")({
  component: () => (
    <AppShell requireAdmin>
      <Admin />
    </AppShell>
  ),
});

interface UserRow { id: string; name: string; email: string; created_at: string }
interface Txn {
  id: string; user_id: string; amount: number; type: string; category: string;
  date: string; status: string;
}

function Admin() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [txns, setTxns] = useState<Txn[]>([]);

  useEffect(() => {
    if (!isAdmin) return;

    async function fetchData() {
      try {
        const res = await fetch("http://localhost:5000/api/admin", {
          credentials: "include",
        });

        const data = await res.json();

        setUsers(data.users || []);
        setTxns(data.transactions || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [isAdmin]);

  const userMap = new Map(users.map((u) => [u.id, u]));
  const high = txns.filter((t) => t.status === "high");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="text-muted-foreground">System-wide oversight</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Users" value={users.length} />
        <Stat label="Transactions" value={txns.length} />
        <Stat label="High-value flags" value={high.length} tone="text-destructive" />
      </div>

      <Tabs defaultValue="high">
        <TabsList>
          <TabsTrigger value="high">High value</TabsTrigger>
          <TabsTrigger value="all">All transactions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="high">
          <TxnTable rows={high} userMap={userMap} />
        </TabsContent>
        <TabsContent value="all">
          <TxnTable rows={txns} userMap={userMap} />
        </TabsContent>
        <TabsContent value="users">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
                <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Joined</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border/40 last:border-none">
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">No users.</td></tr>}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-2 text-3xl font-bold ${tone ?? ""}`}>{value}</div>
    </div>
  );
}

function TxnTable({ rows, userMap }: { rows: Txn[]; userMap: Map<string, UserRow> }) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border/60 bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="p-3">Date</th>
            <th className="p-3">User</th>
            <th className="p-3">Category</th>
            <th className="p-3">Type</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Nothing here.</td></tr>}
          {rows.map((t) => {
            const u = userMap.get(t.user_id);
            return (
              <tr key={t.id} className="border-b border-border/40 last:border-none">
                <td className="p-3">{t.date}</td>
                <td className="p-3">
                  <div className="font-medium">{u?.name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{u?.email}</div>
                </td>
                <td className="p-3">{t.category}</td>
                <td className="p-3 capitalize">{t.type}</td>
                <td className="p-3">
                  {t.status === "high"
                    ? <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-xs text-destructive">HIGH</span>
                    : <span className="text-xs text-muted-foreground">normal</span>}
                </td>
                <td className={`p-3 text-right font-semibold ${t.type === "income" ? "text-primary" : "text-warning"}`}>
                  {Number(t.amount).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
