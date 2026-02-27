import { BrowserRouter } from "react-router-dom";
import './App.css'
import AppRouter from "./app/router";
import { AuthProvider } from './contexts/AuthContext';
import { VideoProvider } from "./contexts/VideoContext";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient();;
export default function App() {
  return (

    <BrowserRouter>
      <AuthProvider>
        <VideoProvider>
          <QueryClientProvider client={queryClient}>
            <AppRouter />
          </QueryClientProvider>
        </VideoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
