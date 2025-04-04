
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Admin from "./pages/Admin";
import ContactDetails from "./pages/ContactDetails";
import ManualContactDetails from "./pages/ManualContactDetails";
import GroupedAssessmentDetails from "./pages/GroupedAssessmentDetails";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<ManualContactDetails />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/contact/view" element={<ContactDetails />} />
            <Route path="/contact/manual" element={<ManualContactDetails />} />
            <Route path="/contact/grouped-assessment" element={<GroupedAssessmentDetails />} />
            <Route path="/past-conversations" element={<div>Past Conversations - Coming Soon</div>} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
