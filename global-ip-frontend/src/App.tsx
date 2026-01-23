import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Toaster position="top-right" richColors closeButton />
        <Router>
          <AppRoutes />
        </Router>
      </SubscriptionProvider>
    </AuthProvider>
  );
}