import { Children, useState } from 'react';
import styles from './Input.module.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function Input({
  type = 'text',
  labelFor,
  placeholder,
  label,
  ...otherProps
}) {
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {label && (
        <label
          className={styles.inputLabel}
          htmlFor={labelFor}
        >
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          type={isPassword && showPassword ? 'text' : type}
          {...otherProps}
          placeholder={placeholder}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
    </>
  );
}
