import styles from './Avatar.module.css';

export default function Avatar({ children, variant = 'primary'  }) {

  const className = [
    styles[variant]
  ]
  return <div className={className}>{children}</div>;
}
