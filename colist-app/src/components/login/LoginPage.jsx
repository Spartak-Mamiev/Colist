import styles from './LoginPage.module.css';

export default function LoginPage() {
  return (
    <main className={styles.loginPageContainer}>
      <header className={styles.ctaContainer}>
        <h1>Welcome Back</h1>
        <p>Sign in to continue sharing lists</p>
      </header>
      <form>
        <div className={styles.loginInputContainer}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Your name"
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="your@email.com"
          />
        </div>
        <button type="submit">Sign in</button>
      </form>
      <p>
        Not registered? <a href="/signup">Sign up</a>.
      </p>
    </main>
  );
}
