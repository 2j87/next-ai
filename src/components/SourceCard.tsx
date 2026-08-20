import type { Post } from '../types';
import styles from './SourceCard.module.css';

interface SourceCardProps {
    post: Post;
    referenceNumber: number;
}

function avatarInitial(username: string): string {
    return username.replace('@', '').charAt(0).toUpperCase();
}

function avatarHue(username: string): number {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
}

function SourceCard({ post, referenceNumber }: SourceCardProps) {
    const hue = avatarHue(post.username);

    return (
        <article id={`kaynak-${referenceNumber}`} className={styles.card}>
            <div
                className={styles.avatar}
                style={{ background: `hsl(${hue}, 55%, 42%)` }}
                aria-hidden="true"
            >
                {avatarInitial(post.username)}
            </div>
            <div className={styles.body}>
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
                    <time className={styles.time} dateTime={post.timestamp}>
                        {new Date(post.timestamp).toLocaleString('tr-TR')}
                    </time>
                </header>
                <p className={styles.content}>{post.content}</p>
                <footer className={styles.footer}>
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
            </div>
        </article>
    );
}

export default SourceCard;
