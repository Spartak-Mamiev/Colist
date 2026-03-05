import styles from './SignUpPage.module.css';

import Input from '../ui/input/Input';
import Button from '../ui/button/Button';

import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function SignUpPage() {
  return (
    <div className={styles.signUpPage}>
      <header className={styles.pageHeader}>
        <Link to="/">
          <FaArrowLeft />
        </Link>
        <h1>Sign Up</h1>
      </header>
      <main>
        <Input></Input>
      </main>
    </div>
  );
}
