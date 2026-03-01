import Button from '../button/Button';
import styles from './Header.module.css';
import { GiHamburgerMenu } from 'react-icons/gi';
import { GoGear } from 'react-icons/go';
import { Link } from 'react-router-dom';

export default function Header({ children }) {
  return (
    <header className={styles.header}>
      <Button variant="transparent">
        <GiHamburgerMenu />
      </Button>
      <h1 className={styles.title}>{children}</h1>
      <Link
        to="/settings"
        className={styles.settingsBtn}
      >
        <GoGear />
      </Link>
    </header>
  );
}
