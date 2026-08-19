interface LoadingIndicatorProps {
  message: string;
}

function LoadingIndicator({ message }: LoadingIndicatorProps) {
  return (
    <div role="status" aria-live="polite">
      <p>{message}</p>
    </div>
  );
}

export default LoadingIndicator;
