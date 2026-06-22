import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './components/AuthProvider.tsx';
import { NowProvider } from './context/NowContext.tsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NowProvider>
          <App />
        </NowProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
