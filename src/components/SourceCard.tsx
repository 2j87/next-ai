import type { Post } from '../types';
import styles from './SourceCard.module.css';

interface SourceCardProps {
  post: Post;
  referenceNumber: number;
}

function SourceCard({ post, referenceNumber }: SourceCardProps) {
  return (
    <article id={`kaynak-${referenceNumber}`} className={styles.card}>
      <header className={styles.header}>
        <span className={styles.username}>{post.username}</span>
        {post.isVerified && (
          <span
            className={styles.badge}
            title="Doğrulanmış Kaynak"
            aria-label="Doğrulanmış Kaynak"
          >
            ✔ Doğrulanmış Kaynak
          </span>
        )}
      </header>
      <p className={styles.content}>{post.content}</p>
      <footer className={styles.footer}>
        <time dateTime={post.timestamp}>
          {new Date(post.timestamp).toLocaleString('tr-TR')}
        </time>
        <a
          href={post.url}
          target="_blank"
          rel="noreferrer"
          className={styles.link}
          aria-label={`${post.username} kullanıcısının gönderisine git`}
        >
          Gönderiye Git
        </a>
      </footer>
    </article>
  );
}

export default SourceCard;
