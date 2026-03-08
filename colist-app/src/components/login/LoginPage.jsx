import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginPage.module.css';

import Button from '../ui/button/Button';
import Input from '../ui/input/Input';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();

  const [error, setError] = useState(null); // Stores login error messages
  const [loading, setLoading] = useState(false); // True while the sign-in request is in flight

  // Check if this is a first-time visitor (no record of previous login)
  const isFirstVisit = !localStorage.getItem('hasVisited');

  // Redirect to home if user is already logged in
  if (user) {
    navigate('/', { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Grab email and password from the form inputs
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Call Supabase signIn — returns { data, error }
    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      // Show the error message to the user
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // On success, mark as returning visitor and navigate to the main page
    localStorage.setItem('hasVisited', 'true');
    navigate('/');
  }

  return (
    <main className={styles.loginPageContainer}>
      <div className={styles.logoBar}>
        <img
          src="/logo-square.jpg"
          alt="Colist logo"
          className={styles.logo}
        />
      </div>
      <header className={styles.ctaContainer}>
        <h1 className={styles.title}>
          {isFirstVisit ? 'Welcome to Grocio' : 'Welcome Back'}
        </h1>
        <p className={styles.subtitle}>
          {isFirstVisit
            ? 'Sign up to start sharing your lists'
            : 'Sign in to continue sharing lists'}
        </p>
      </header>
      <form
        className={styles.loginForm}
        onSubmit={handleSubmit}
      >
        <div className={styles.loginInputContainer}>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="your@email.com"
            label="Email"
            labelFor="email"
            required
          />
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Your password"
            label="Password"
            labelFor="password"
            required
          />
        </div>

        {/* Display login error if there is one */}
        {error && <p className={styles.error}>{error}</p>}

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      <p className={styles.signupPrompt}>
        Not registered?{' '}
        <Link
          className={styles.signupLink}
          to="/signup"
        >
          Sign up
        </Link>
        .
      </p>
    </main>
  );
}
