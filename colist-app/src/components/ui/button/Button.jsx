import styles from './Button.module.css';

function Button({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled,
  type = 'button',
  fullWidth,
  ...rest // Spread remaining props (e.g. aria-label) onto the button element
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
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
