
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import GuardianDashboard from "./components/guardian/GuardianDashboard";
import DriverDashboard from "./components/driver/DriverDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import { SupabaseAuthProvider } from "./contexts/SupabaseAuthContext";
import { AuthProvider } from "./contexts/AuthContext"; // Keep for backward compatibility during migration

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <AuthProvider> {/* Add back AuthProvider during migration to maintain compatibility */}
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/guardian/dashboard" element={<GuardianDashboard />} />
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;
