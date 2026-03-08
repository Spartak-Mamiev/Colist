import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ResetPassword.module.css';
import Button from '../ui/button/Button';
import Input from '../ui/input/Input';
import supabase from '../../lib/supabaseClient';

export default function ResetPassword() {
  const navigate = useNavigate();

  // Determine if user arrived via a reset link (has a session with recovery type)
  const [isRecovery, setIsRecovery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Listen for the PASSWORD_RECOVERY event when user clicks the email link
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Step 1: Send reset email
  async function handleSendReset(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const email = e.target.email.value.trim();
    if (!email) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/reset-password` },
    );

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage('Check your email for a password reset link');
    }
    setLoading(false);
  }

  // Step 2: Set new password (after clicking email link)
  async function handleUpdatePassword(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage('Password updated! Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    }
    setLoading(false);
  }

  return (
    <main className={styles.container}>
      <div className={styles.logoBar}>
        <img
          src="/logo-square.jpg"
          alt="Grocio logo"
          className={styles.logo}
        />
      </div>

      {isRecovery ? (
        <>
          <header className={styles.header}>
            <h1>Set New Password</h1>
            <p>Enter your new password below</p>
          </header>
          <form
            className={styles.form}
            onSubmit={handleUpdatePassword}
          >
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="New password"
              label="New Password"
              labelFor="password"
              required
            />
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm new password"
              label="Confirm Password"
              labelFor="confirmPassword"
              required
            />
            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </>
      ) : (
        <>
          <header className={styles.header}>
            <h1>Reset Password</h1>
            <p>Enter your email and we'll send you a reset link</p>
          </header>
          <form
            className={styles.form}
            onSubmit={handleSendReset}
          >
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="your@email.com"
              label="Email"
              labelFor="email"
              required
            />
            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </>
      )}
    </main>
  );
}
