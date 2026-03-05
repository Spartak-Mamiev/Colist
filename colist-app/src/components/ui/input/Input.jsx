import styles from './Input.module.css';

export default function Input({
  type = 'text',
  labelFor,
  label,
  ...otherProps
}) {
  return (
    <>
      <label
        className={styles.inputLabel}
        htmlFor={labelFor}
      >
        {label}
      </label>
      <input
        className={styles.input}
        type={type}
        {...otherProps}
      />
    </>
  );
}
