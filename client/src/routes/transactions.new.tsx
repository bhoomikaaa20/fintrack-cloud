import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/transactions/new")({
  component: () => (
    <AppShell>
      <NewTxn />
    </AppShell>
  ),
});

const CATEGORIES = ["Salary", "Freelance", "Investment", "Food", "Transport", "Rent", "Utilities", "Equipment", "Entertainment", "Other"];

function NewTxn() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("Other");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 0) return toast.error("Enter a valid amount");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("amount", String(amt));
      formData.append("type", type);
      formData.append("category", category);
      formData.append("date", date);
      formData.append("description", description);

      if (file) {
        formData.append("file", file);
      }

      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success(amt > 50000 ? "Saved — flagged as HIGH value" : "Transaction saved");

      navigate({ to: "/transactions" });

    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New transaction</h1>
        <p className="text-muted-foreground">Amounts over $50,000 are auto-flagged as high value.</p>
      </div>
      <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border/60 bg-card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Amount</Label>
            <Input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div>
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as "income" | "expense")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
        </div>
        <div>
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={500} />
        </div>
        <div>
          <Label>Receipt (optional)</Label>
          <Input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/transactions" })}>Cancel</Button>
          <Button type="submit" disabled={loading} className="bg-emerald-gradient text-primary-foreground hover:opacity-90">
            {loading ? "Saving…" : "Save transaction"}
          </Button>
        </div>
      </form>
    </div>
  );
}
