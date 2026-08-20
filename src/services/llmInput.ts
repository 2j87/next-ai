import type { Post } from '../types';
import { stripHashtagsAndMentions, stripUrls, toAsciiLower } from './textUtils';

function normalizePostText(content: string): string {
    return toAsciiLower(stripHashtagsAndMentions(stripUrls(content)))
        .replace(/\s+/g, ' ')
        .trim();
}

// Builds the plain-text document handed to the summarization LLM: each post
// becomes a "[n] ..." block, links/hashtags/mentions removed and the text
// normalized to lowercase ASCII, numbered to match SummaryReference so the
// LLM's citations line up with the source cards shown in the UI.
export function buildLlmInput(posts: Post[]): string {
    return posts
        .map((post, index) => `[${index + 1}] ${normalizePostText(post.content)}`)
        .join('\n\n');
}
