import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/components/Login';
import Register from './features/auth/components/Register';
import Dashboard from './features/dashboard/components/Dashboard';
import Profile from './features/profile/components/Profile';
import RecipeDetails from './features/recipes/components/RecipeDetails';
import NotFound from './UIComponents/components/NotFound';
import Navbar from './UIComponents/components/Navbar';
import ProtectedRoute from './UIComponents/components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="app-main">
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipe/:id"
            element={
              <ProtectedRoute>
                <RecipeDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId?"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
