import styles from './Avatar.module.css';

export default function Avatar({ children }) {
  return <div className={styles.avatarContainer}>{children}</div>;
}
