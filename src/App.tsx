import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ArticlePage from "./pages/ArticlePage";
import CategoryPage from "./pages/CategoryPage";
import ServicePage from "./pages/ServicePage";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const AdminArticles = lazy(() => import("./pages/AdminArticles"));
const AdminArticleEditor = lazy(() => import("./pages/AdminArticleEditor"));
const AdminServicePages = lazy(() => import("./pages/AdminServicePages"));
const AdminServicePageEditor = lazy(() => import("./pages/AdminServicePageEditor"));

const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <p className="text-muted-foreground">Carregando…</p>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <WhatsAppButton />
          <Suspense fallback={<AdminFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/categorias" element={<AdminCategories />} />
            <Route path="/admin/artigos" element={<AdminArticles />} />
            <Route path="/admin/artigos/:id" element={<AdminArticleEditor />} />
            <Route path="/admin/servicos" element={<AdminServicePages />} />
            <Route path="/admin/servicos/:id" element={<AdminServicePageEditor />} />
            <Route path="/servicos/:slug" element={<ServicePage />} />
            <Route path="/:categorySlug" element={<CategoryPage />} />
            <Route path="/:categorySlug/:articleSlug" element={<ArticlePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
