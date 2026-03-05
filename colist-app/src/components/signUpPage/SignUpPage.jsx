import styles from './SignUpPage.module.css';

import Input from '../ui/input/Input';
import Button from '../ui/button/Button';

import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUpPage() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/');
  }

  return (
    <div className={styles.signUpPage}>
      <header className={styles.pageHeader}>
        <Link to="/login">
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
            labelFor="Password"
            required
          ></Input>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Confirm Your Password"
            required
          ></Input>
          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
          >
            Sign Up
          </Button>
        </form>
      </main>
    </div>
  );
}
