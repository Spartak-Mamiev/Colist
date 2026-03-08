import { useState } from 'react';
import styles from './Settings.module.css';
import Button from '../ui/button/Button';
import Input from '../ui/input/Input';
import Avatar from '../ui/avatar/Avatar';
import Header from '../ui/header/Header';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import supabase from '../../lib/supabaseClient';

import { useNavigate } from 'react-router-dom';

import { RxExit } from 'react-icons/rx';

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Get display name from user metadata (set during sign-up), fallback to email
  const displayName = user?.user_metadata?.name || 'User';
  const email = user?.email || '';
  // Use the first letter of the name for the avatar
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const { theme, setTheme } = useTheme(); // Current theme preference and setter
  const [saveMessage, setSaveMessage] = useState(null); // Success/error message for profile save
  const [saving, setSaving] = useState(false); // True while saving profile

  // Handle log out — sign out of Supabase then redirect to login
  async function handleLogOut() {
    await signOut();
    navigate('/login');
  }

  // Handle saving profile changes to the profiles table
  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaveMessage(null);
    setSaving(true);

    const newName = e.target.name.value.trim();
    const newEmail = e.target.email.value.trim();

    if (!newName) {
      setSaveMessage({ type: 'error', text: 'Name cannot be empty' });
      setSaving(false);
      return;
    }

    // Update the profiles table
    const { error } = await supabase
      .from('profiles')
      .update({ name: newName, email: newEmail })
      .eq('id', user.id);

    if (error) {
      setSaveMessage({ type: 'error', text: error.message });
    } else {
      setSaveMessage({ type: 'success', text: 'Profile updated!' });
    }

    setSaving(false);
  }

  return (
    <div className={styles.settingsPage}>
      <Header
        showBack
        showSettings={false}
      >
        Settings
      </Header>
      <main className={styles.mainContent}>
        <section
          className={styles.section}
          aria-labelledby="profile-heading"
        >
          <h2 id="profile-heading">Profile</h2>
          <div className={styles.profileSummary}>
            <Avatar variant="large">{avatarInitial}</Avatar>
            <div className={styles.profileText}>
              <h3>{displayName}</h3>
              <p>{email}</p>
            </div>
          </div>
          <form
            className={styles.profileForm}
            onSubmit={handleSaveProfile}
          >
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              label="Name"
              labelFor="name"
              defaultValue={displayName}
            />
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="you@email.com"
              label="Email"
              labelFor="email"
              defaultValue={email}
            />
            {/* Show save success or error message */}
            {saveMessage && (
              <p
                className={
                  saveMessage.type === 'error' ? styles.error : styles.success
                }
              >
                {saveMessage.text}
              </p>
            )}
            <Button
              type="submit"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
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
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </section>

        <section
          className={styles.section}
          aria-labelledby="notifications-heading"
        >
          <h2 id="notifications-heading">Notifications</h2>
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
          <h2 id="account-heading">Account</h2>
          <Button
            type="button"
            variant="logout"
            onClick={handleLogOut}
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
