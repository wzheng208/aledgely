import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import RecordsPage from '@/pages/RecordsPage';
import SettingsPage from '@/pages/SettingsPage';
import ProtectedRoute from '@/components/auth/ProtectRoute';
import { AppShell } from '@/components/layout/AppShell';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <Navigate
              to='/dashboard'
              replace
            />
          }
        />

        <Route
          path='/login'
          element={<LoginPage />}
        />

        <Route
          path='/register'
          element={<RegisterPage />}
        />

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route
            path='/dashboard'
            element={<DashboardPage />}
          />
          <Route
            path='/records'
            element={<RecordsPage />}
          />
          <Route
            path='/settings'
            element={<SettingsPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
