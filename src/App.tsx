import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DNAja from "./pages/DNAja";
import NovoExame from "./pages/NovoExame";
import ListaExames from "./pages/ListaExames";
import Simulador from "./pages/Simulador";
import Tendencias from "./pages/Tendencias";
import Auditoria from "./pages/Auditoria";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dnaja" element={<DNAja />} />
              <Route path="/exames/novo" element={<NovoExame />} />
              <Route path="/exames" element={<ListaExames />} />
              <Route path="/simulador" element={<Simulador />} />
              <Route path="/tendencias" element={<Tendencias />} />
              <Route path="/auditoria" element={<Auditoria />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
