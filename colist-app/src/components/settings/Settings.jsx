import styles from './Settings.module.css';
import Button from '../ui/button/Button';
import Input from '../ui/input/Input';
import Avatar from '../ui/avatar/Avatar';

import { FaArrowLeft } from 'react-icons/fa';
import { RxExit } from 'react-icons/rx';
import { CiDark } from 'react-icons/ci';
import { CiLight } from 'react-icons/ci';
import { Link } from 'react-router-dom';

export default function Settings() {
  return (
    <div className={styles.settingsPage}>
      <header className={styles.pageHeader}>
        <Link to="/">
          <FaArrowLeft />
        </Link>
        <h1>Settings</h1>
      </header>
      <main className={styles.mainContent}>
        <section
          className={styles.section}
          aria-labelledby="profile-heading"
        >
          <h2 id="profile-heading">Profile</h2>
          <div className={styles.profileSummary}>
            <Avatar variant="large">Y</Avatar>
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
            className={styles.select}
          >
            <option value="Light">
              <CiLight />
              Light
            </option>
            <option value="Dark">
              <CiDark />
              Dark
            </option>
          </select>
        </section>

        <section
          className={styles.section}
          aria-labelledby="notifications-heading"
        >
          <h3 id="notifications-heading">Notifications</h3>
          <div className={styles.notificationRow}>
            <div className={styles.notificationText}>
              <h4>Push Notifications</h4>
              <p>Get notifies when items are added or checked off</p>
            </div>
            <input
              type="checkbox"
              id="push-notifications"
              name="pushNotifications"
              className={styles.toggleInput}
            />
            <label
              htmlFor="push-notifications"
              className={styles.toggle}
              aria-label="Enable push notifications"
            >
              <span className={styles.toggleThumb}></span>
            </label>
          </div>
        </section>

        <section
          className={styles.section}
          aria-labelledby="account-heading"
        >
          <h3 id="account-heading">Account</h3>
          <Button
            type="Button"
            variant="logout"
          >
            <RxExit />
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
