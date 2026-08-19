import type { Post } from '../types';

interface SourceCardProps {
  post: Post;
  referenceNumber: number;
}

function SourceCard({ post, referenceNumber }: SourceCardProps) {
  return (
    <article id={`kaynak-${referenceNumber}`}>
      <header>
        <span>{post.username}</span>
        {post.isVerified && (
          <span title="Doğrulanmış Kaynak" aria-label="Doğrulanmış Kaynak">
            ✔ Doğrulanmış Kaynak
          </span>
        )}
      </header>
      <p>{post.content}</p>
      <footer>
        <time dateTime={post.timestamp}>
          {new Date(post.timestamp).toLocaleString('tr-TR')}
        </time>
        <a
          href={post.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${post.username} kullanıcısının gönderisine git`}
        >
          Gönderiye Git
        </a>
      </footer>
    </article>
  );
}

export default SourceCard;
