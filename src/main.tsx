import './styles/globals.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from './app/app.layout';
import { RunningPage } from './app/game/running.page';
import { StartPage } from './app/game/start.page';

import { Toaster } from './components/ui/sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="top-center" />
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<AppLayout />}
        >
          <Route
            index
            element={<StartPage />}
          />
          <Route
            path="/:difficulty"
            element={<RunningPage />}
          />
        </Route>
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
