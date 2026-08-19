interface SummaryDisplayProps {
  text: string;
}

function SummaryDisplay({ text }: SummaryDisplayProps) {
  const parts = text.split(/(\[\d+\])/g);

  return (
    <section aria-label="Özet">
      <p>
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
