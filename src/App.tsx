import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/lib/i18n";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdBlockDetector } from "@/components/AdBlockDetector";
import { CookieConsent } from "@/components/CookieConsent";
import { NotificationPrompt } from "@/components/NotificationPrompt";
import Index from "./pages/Index";
import DailyPicks from "./pages/DailyPicks";
import Premium from "./pages/Premium";
import Stats from "./pages/Stats";
import Games from "./pages/Games";
import Tips from "./pages/Tips";
import TipDetail from "./pages/TipDetail";
import Auth from "./pages/Auth";
import Disclaimer from "./pages/Disclaimer";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Referral from "./pages/Referral";
import Dashboard from "./pages/admin/Dashboard";
import AdminArchive from "./pages/admin/Archive";
import QuizGame from "./pages/games/QuizGame";
import ScorePrediction from "./pages/games/ScorePrediction";
import AccumulatorChallenge from "./pages/games/AccumulatorChallenge";
import ApiTest from "./pages/ApiTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AdBlockDetector />
          <CookieConsent />
          <NotificationPrompt />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/daily-picks" element={<DailyPicks />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/quiz" element={<QuizGame />} />
            <Route path="/games/score-prediction" element={<ScorePrediction />} />
            <Route path="/games/accumulator" element={<AccumulatorChallenge />} />
            <Route path="/tips" element={<Tips />} />
            <Route path="/tips/:slug" element={<TipDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/referral" element={<Referral />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/archive" element={<AdminArchive />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/api-test" element={<ApiTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
