import styles from './LoadingIndicator.module.css';

interface LoadingIndicatorProps {
  message: string;
}

function LoadingIndicator({ message }: LoadingIndicatorProps) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export default LoadingIndicator;
