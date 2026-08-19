import styles from './SummaryDisplay.module.css';

interface SummaryDisplayProps {
  text: string;
}

function SummaryDisplay({ text }: SummaryDisplayProps) {
  const parts = text.split(/(\[\d+\])/g);

  return (
    <section className={styles.summary} aria-label="Özet">
      <p className={styles.text}>
        {parts.map((part, index) => {
          const match = part.match(/^\[(\d+)\]$/);
          if (!match) {
            return <span key={index}>{part}</span>;
          }

          const number = match[1];

          return (
            <a
              key={index}
              href={`#kaynak-${number}`}
              className={styles.refLink}
              aria-label={`${number} numaralı kaynağa git`}
            >
              [{number}]
            </a>
          );
        })}
      </p>
    </section>
  );
}

export default SummaryDisplay;
