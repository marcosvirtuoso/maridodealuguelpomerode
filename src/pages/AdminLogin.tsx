import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
    } else {
      navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-card rounded-xl shadow-2xl p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-gold" />
          </div>
          <span className="text-lg font-bold text-foreground">Painel Admin</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-foreground">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-black"
              placeholder="admin@exemplo.com"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-foreground">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-black"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gold hover:bg-gold/90 text-primary font-semibold">
            <LogIn className="w-4 h-4 mr-2" />
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
