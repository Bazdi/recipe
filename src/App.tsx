import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { LoginForm, RegisterForm, ProtectedRoute } from './components/auth';
import { MainLayout } from './components/layout';
import { Dashboard } from './pages/Dashboard';
import { RecipesPage } from './pages/RecipesPage';
import { PantryPage } from './pages/PantryPage';
import { GoalsPage } from './pages/GoalsPage';
import { ShoppingPage } from './pages/ShoppingPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="recipes" element={<RecipesPage />} />
            <Route path="pantry" element={<PantryPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="shopping" element={<ShoppingPage />} />
            <Route path="search" element={<div>Search Page (Coming Soon)</div>} />
            <Route path="planning" element={<div>Planning Page (Coming Soon)</div>} />
            <Route path="nutrition" element={<div>Nutrition Page (Coming Soon)</div>} />
            <Route path="profile" element={<div>Profile Page (Coming Soon)</div>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
