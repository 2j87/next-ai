import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';
import SummaryDisplay from '../components/SummaryDisplay';
import SourceCard from '../components/SourceCard';
import { fetchRelevantPosts, generateSummary } from '../services/mockDataService';
import type { SearchQuery, SummaryResult, TimeRangeOption } from '../types';

type Phase = 'collecting' | 'summarizing' | 'done';

function Results() {
  const [searchParams] = useSearchParams();
  const [phase, setPhase] = useState<Phase>('collecting');
  const [summary, setSummary] = useState<SummaryResult | null>(null);

  useEffect(() => {
    const query: SearchQuery = {
      keyword: searchParams.get('keyword') ?? '',
      timeRange: (searchParams.get('timeRange') as TimeRangeOption) ?? 'today',
      startDate: searchParams.get('startDate') ?? undefined,
      endDate: searchParams.get('endDate') ?? undefined,
    };

    let cancelled = false;

    async function run() {
      setPhase('collecting');
      await fetchRelevantPosts(query);
      if (cancelled) return;

      setPhase('summarizing');
      const result = await generateSummary(query);
      if (cancelled) return;

      setSummary(result);
      setPhase('done');
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

  return (
    <main>
      <h1>Sonuçlar</h1>
      {summary && (
        <>
          <SummaryDisplay text={summary.text} />
          <section aria-label="Kaynaklar">
            {summary.references.map((ref) => {
              const post = summary.posts.find((p) => p.id === ref.postId);
              if (!post) return null;
              return (
                <SourceCard key={ref.postId} post={post} referenceNumber={ref.number} />
              );
            })}
          </section>
        </>
      )}
    </main>
  );
}

export default Results;
