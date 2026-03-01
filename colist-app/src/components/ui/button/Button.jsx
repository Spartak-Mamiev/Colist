import styles from './Button.module.css';

function Button({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled,
  type = 'button',
  fullWidth,
}) {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;
