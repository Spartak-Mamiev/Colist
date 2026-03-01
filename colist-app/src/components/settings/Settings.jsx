import styles from './Settings.module.css';
import Button from '../ui/Button';
import Input from '../ui/input/Input';

export default function Settings() {
  return (
    <div className={styles.settingsPage}>
      <header className={styles.pageHeader}>
        <Button type="Button">Back</Button>
        <h1>Settings</h1>
      </header>
      <main className={styles.mainContent}>
        <section
          className={styles.section}
          aria-labelledby="profile-heading"
        >
          <h2 id="profile-heading">Profile</h2>
          <div className={styles.profileSummary}>
            <img
              src=""
              alt="avatar"
            />
            <div className={styles.profileText}>
              <h3>You</h3>
              <p>you@mail.com</p>
            </div>
          </div>
          <form className={styles.profileForm}>
            <label htmlFor="name">Name</label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
            />
            <label htmlFor="email">Email</label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="you@email.com"
            />
            <Button type="submit">Save Changes</Button>
          </form>
        </section>

        <section
          className={styles.section}
          aria-labelledby="appearance-heading"
        >
          <h2 id="appearance-heading">Appearance</h2>
          <label htmlFor="theme">Theme</label>
          <select
            name="theme"
            id="theme"
          >
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
          </select>
        </section>

        <section
          className={styles.section}
          aria-labelledby="notifications-heading"
        >
          <h2 id="notifications-heading">Notifications</h2>
          <div className={styles.notificationRow}>
            <div className={styles.notificationText}>
              <h3>Push Notifications</h3>
              <p>Get notifies when items are added or checked off</p>
            </div>
            <input
              type="checkbox"
              id="push-notifications"
              name="pushNotifications"
            />
            <label htmlFor="push-notifications">
              Enable push notifications
            </label>
          </div>
        </section>

        <section
          className={styles.section}
          aria-labelledby="account-heading"
        >
          <h2 id="account-heading">Account</h2>
          <Button
            type="Button"
            variant="logout"
          >
            Log Out
          </Button>
        </section>

        <footer className={styles.pageFooter}>
          <p>Colist v1.0.0</p>
          <p>Made with care for better grocery shopping</p>
        </footer>
      </main>
    </div>
  );
}
