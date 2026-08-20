import styles from './SummaryDisplay.module.css';

interface SummaryDisplayProps {
    text: string;
}

function SummaryDisplay({ text }: SummaryDisplayProps) {
    const parts = text.split(/(\[\d+\])/g);

    return (
        <section className={styles.summary} aria-label="Özet">
            <div className={styles.summaryHeader}>
                <span className="material-symbols-outlined fill" aria-hidden="true">
                    auto_awesome
                </span>
                <span className={styles.summaryLabel}>AI Özeti</span>
            </div>
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
                            className={styles.refBadge}
                            aria-label={`${number} numaralı kaynağa git`}
                        >
                            {number}
                        </a>
                    );
                })}
            </p>
        </section>
    );
}

export default SummaryDisplay;
