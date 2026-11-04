import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { ConsultationProvider } from '@/context/ConsultationContext';
import { AppRoutes } from '@/routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ConsultationProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ConsultationProvider>
    </ThemeProvider>
  );
};

export default App;
