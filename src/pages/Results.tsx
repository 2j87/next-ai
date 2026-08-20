import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';
import SummaryDisplay from '../components/SummaryDisplay';
import SourceCard from '../components/SourceCard';
import { fetchRelevantPosts, generateSummary } from '../services/postService';
import { TIME_RANGE_LABELS, type SearchQuery, type SummaryResult, type TimeRangeOption } from '../types';
import styles from './Results.module.css';

type Phase = 'collecting' | 'summarizing' | 'done' | 'error';

function Results() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [phase, setPhase] = useState<Phase>('collecting');
    const [summary, setSummary] = useState<SummaryResult | null>(null);

    const keyword = searchParams.get('keyword') ?? '';
    const timeRange = (searchParams.get('timeRange') as TimeRangeOption) ?? 'today';

    useEffect(() => {
        const query: SearchQuery = {
            keyword: searchParams.get('keyword') ?? '',
            timeRange: (searchParams.get('timeRange') as TimeRangeOption) ?? 'today',
            startDate: searchParams.get('startDate') ?? undefined,
            endDate: searchParams.get('endDate') ?? undefined,
        };

        let cancelled = false;

        async function run() {
            try {
                setPhase('collecting');
                const posts = await fetchRelevantPosts(query);
                if (cancelled) return;

                setPhase('summarizing');
                const result = await generateSummary(query, posts);
                if (cancelled) return;

                setSummary(result);
                setPhase('done');
            } catch {
                if (!cancelled) setPhase('error');
            }
        }

        run();

        return () => {
            cancelled = true;
        };
    }, [searchParams]);

    if (phase === 'collecting') {
        return <LoadingIndicator message="İlgili gönderiler toplanıyor..." />;
    }

    if (phase === 'summarizing') {
        return <LoadingIndicator message="Özet oluşturuluyor..." />;
    }

    if (phase === 'error') {
        return (
            <main className={styles.page}>
                <h1 className={styles.title}>Sonuçlar</h1>
                <p>Gönderiler alınamadı, lütfen tekrar dene.</p>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <div className={styles.header}>
                <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                    aria-label="Geri git"
                >
                    <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
                </button>
                <div className={styles.headerText}>
                    <h1 className={styles.title}>{keyword || 'Sonuçlar'}</h1>
                    <p className={styles.subtitle}>{TIME_RANGE_LABELS[timeRange]}</p>
                </div>
            </div>

            {summary && (
                <>
                    <SummaryDisplay text={summary.text} />
                    {summary.references.length > 0 && (
                        <section className={styles.sources} aria-label="Kaynaklar">
                            <h2 className={styles.sourcesHeading}>
                                <span className="material-symbols-outlined" aria-hidden="true">forum</span>
                                Kaynak Gönderiler
                            </h2>
                            {summary.references.map((ref) => {
                                const post = summary.posts.find((p) => p.id === ref.postId);
                                if (!post) return null;
                                return (
                                    <SourceCard key={ref.postId} post={post} referenceNumber={ref.number} />
                                );
                            })}
                        </section>
                    )}
                </>
            )}
        </main>
    );
}

export default Results;
