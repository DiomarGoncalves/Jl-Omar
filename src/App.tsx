import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Trucks } from './pages/Trucks';
import { TruckDetail } from './pages/TruckDetail';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Measurements } from './pages/Measurements';
import { Reports } from './pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trucks"
            element={
              <ProtectedRoute>
                <Trucks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trucks/:id"
            element={
              <ProtectedRoute>
                <TruckDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services/:id"
            element={
              <ProtectedRoute>
                <ServiceDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/measurements"
            element={
              <ProtectedRoute>
                <Measurements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
