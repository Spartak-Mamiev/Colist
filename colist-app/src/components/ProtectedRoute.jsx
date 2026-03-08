import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrapper component that protects routes from unauthenticated access.
// If the user is not logged in, they get redirected to /login.
// While the auth session is loading, a loading message is shown.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Still checking for an existing session — show a loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // No user session found — redirect to login page
  // `replace` prevents the login redirect from being added to browser history
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // User is authenticated — render the protected content
  return children;
}
