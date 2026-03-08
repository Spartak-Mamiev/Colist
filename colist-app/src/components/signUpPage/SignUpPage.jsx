import { useState } from 'react';
import styles from './SignUpPage.module.css';

import Input from '../ui/input/Input';
import Button from '../ui/button/Button';
import { useAuth } from '../../context/AuthContext';

import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [error, setError] = useState(null); // Stores sign-up error messages
  const [loading, setLoading] = useState(false); // True while the sign-up request is in flight

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Grab form values
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // Validate that passwords match before calling Supabase
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    // Call Supabase signUp — name is stored in user metadata
    // and copied to the profiles table via the database trigger
    const { error: signUpError } = await signUp(email, password, name);

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // On success, navigate to the main page
    navigate('/');
  }

  return (
    <div className={styles.signUpPage}>
      <header className={styles.pageHeader}>
        <Link
          to="/login"
          aria-label="Go back"
        >
          <FaArrowLeft />
        </Link>
        <h1>Sign Up</h1>
      </header>
      <main>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            label="Name"
            labelFor="name"
            required
          ></Input>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
            label="Email"
            labelFor="email"
            required
          ></Input>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Your Password"
            label="Password"
            labelFor="password"
            required
          ></Input>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Your Password"
            label="Confirm Password"
            labelFor="confirmPassword"
            required
          ></Input>

          {/* Display sign-up error if there is one */}
          {error && <p className={styles.error}>{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>
      </main>
    </div>
  );
}
