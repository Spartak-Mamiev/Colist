import { Link } from 'react-router-dom';
import styles from './LoginPage.module.css';

import Button from '../ui/button/Button';
import Input from '../ui/input/Input';

export default function LoginPage() {
  return (
    <main className={styles.loginPageContainer}>
      <header className={styles.ctaContainer}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to continue sharing lists</p>
      </header>
      <form className={styles.loginForm}>
        <div className={styles.loginInputContainer}>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Your name"
            label="Name"
            labelFor="name"
          />
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="your@email.com"
            label="Email"
            labelFor="email"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
        >
          Sign in
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
