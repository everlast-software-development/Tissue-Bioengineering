import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/context/ThemeContext';
import { ConsultationProvider } from '@/context/ConsultationContext';
import { AppRoutes } from '@/routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ConsultationProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ConsultationProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
