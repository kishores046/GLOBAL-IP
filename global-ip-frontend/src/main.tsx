
  import { createRoot } from "react-dom/client";
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  import App from "./App.tsx";
  import "./index.css";

  // Create a client for React Query
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 2,
        staleTime: 10000, // 10 seconds
      },
    },
  });

  createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
  