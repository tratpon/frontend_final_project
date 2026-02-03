import { BrowserRouter } from "react-router-dom";
import './App.css'
import AppRouter from "./app/router";
import { AuthProvider } from './contexts/authContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient();;
export default function App() {
  return (
    
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>  
          <AppRouter />
        </QueryClientProvider>
        
      </AuthProvider>
    </BrowserRouter>
  );
}
