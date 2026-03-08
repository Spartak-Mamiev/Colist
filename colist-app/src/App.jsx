import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ListsProvider } from './context/ListsContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/login/LoginPage';
import MainPage from './components/mainPage/MainPage';
import './App.css';
import Members from './components/members/Members';
import Settings from './components/settings/Settings';
import ListPage from './components/listPage/ListPage';
import SignUpPage from './components/signUpPage/SignUpPage';
import ResetPassword from './components/resetPassword/ResetPassword';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* AuthProvider wraps all routes so any component can access auth state */}
        <AuthProvider>
          {/* ListsProvider gives all components access to lists data and CRUD functions */}
          <ListsProvider>
            <Routes>
              {/* Public routes — accessible without logging in */}
              <Route
                path="/login"
                element={<LoginPage />}
              />
              <Route
                path="/signup"
                element={<SignUpPage />}
              />
              <Route
                path="/reset-password"
                element={<ResetPassword />}
              />

              {/* Protected routes — redirect to /login if not authenticated */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/list/:listId"
                element={
                  <ProtectedRoute>
                    <ListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members/:listId"
                element={
                  <ProtectedRoute>
                    <Members />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ListsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
