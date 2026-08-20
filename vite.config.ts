import fs from 'node:fs';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

const OUTPUT_DIR = path.resolve(import.meta.dirname, 'output');

// Dev-only middleware: the app is a static frontend with no backend, so this
// is what lets it write the generated llm-input document to a real file on
// disk instead of just logging it or triggering a browser download.
function saveLlmInputPlugin(): Plugin {
    return {
        name: 'save-llm-input',
        configureServer(server) {
            server.middlewares.use('/api/save-llm-input', (req, res) => {
                if (req.method !== 'POST') {
                    res.statusCode = 405;
                    res.end();
                    return;
                }

                // The keyword only ever reaches the filesystem through this
                // allowlist, so a malicious query string can't path-traverse
                // out of OUTPUT_DIR no matter what the client sends.
                const url = new URL(req.url ?? '', 'http://localhost');
                const rawKeyword = url.searchParams.get('keyword') ?? '';
                const safeKeyword = rawKeyword.replace(/[^a-z0-9-]/gi, '').slice(0, 60) || 'sorgu';

                const chunks: Buffer[] = [];
                req.on('data', (chunk) => chunks.push(chunk));
                req.on('end', () => {
                    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const filePath = path.join(OUTPUT_DIR, `${timestamp}_${safeKeyword}.txt`);
                    fs.writeFileSync(filePath, Buffer.concat(chunks), 'utf8');

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ path: filePath }));
                });
            });
        },
    };
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), saveLlmInputPlugin()],
});
