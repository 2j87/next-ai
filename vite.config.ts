import fs from 'node:fs';
import path from 'node:path';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

const OUTPUT_DIR = path.resolve(import.meta.dirname, 'output');

// Sibling checkout of our own inference engine (akasha-core). We talk to its
// `--chat` REPL binary over stdin/stdout rather than a network API - see
// llmInferencePlugin below.
const AKASHA_DIR = path.resolve(import.meta.dirname, '..', 'akasha-core');
const AKASHA_BIN = path.join(AKASHA_DIR, 'target/release/akasha-core');
const AKASHA_WEIGHTS = path.join(AKASHA_DIR, 'checkpoints/model_step_199000.bin');
// WIP checkpoint (very early in continued pretraining) - coherent output is
// not expected yet, this just proves the pipe works end to end.

// Printed by main.rs after every turn (success or failure), flushed
// immediately. Generated text can itself contain real newlines, so this is
// the only reliable "response is complete" signal for a line-based reader.
const END_MARKER = '<<<AKASHA_END>>>';

interface AkashaProcess {
    child: ChildProcessWithoutNullStreams;
    buffer: string;
    ready: Promise<void>;
    queue: Promise<unknown>;
}

let akasha: AkashaProcess | null = null;

function spawnAkasha(): AkashaProcess {
    const child = spawn(AKASHA_BIN, ['--chat', '--weights', AKASHA_WEIGHTS], {
        cwd: AKASHA_DIR,
        stdio: ['pipe', 'pipe', 'pipe'],
    });

    const state: AkashaProcess = {
        child,
        buffer: '',
        queue: Promise.resolve(),
        ready: undefined as unknown as Promise<void>,
    };

    child.stderr.on('data', (chunk: Buffer) => {
        console.error('[akasha-core]', chunk.toString('utf8'));
    });
    child.on('exit', (code) => {
        console.error(`[akasha-core] process exited (code ${code})`);
        if (akasha === state) akasha = null;
    });

    state.ready = new Promise((resolve) => {
        function onStartup(chunk: Buffer) {
            state.buffer += chunk.toString('utf8');
            if (state.buffer.endsWith('> ')) {
                state.buffer = '';
                child.stdout.off('data', onStartup);
                resolve();
            }
        }
        child.stdout.on('data', onStartup);
    });

    return state;
}

function getAkasha(): AkashaProcess {
    if (!akasha) akasha = spawnAkasha();
    return akasha;
}

function encodeForStdin(text: string): string {
    return text.replace(/\r?\n/g, '\\n');
}

async function generate(prompt: string): Promise<string> {
    const state = getAkasha();

    const run = state.queue.then(async () => {
        await state.ready;

        return new Promise<string>((resolve, reject) => {
            function onData(chunk: Buffer) {
                state.buffer += chunk.toString('utf8');
                const markerIndex = state.buffer.indexOf(END_MARKER);
                if (markerIndex === -1) return;

                const responseText = state.buffer.slice(0, markerIndex).trim();
                state.buffer = '';
                state.child.stdout.off('data', onData);
                state.child.off('exit', onExit);
                
                // An empty response means main.rs hit the Err branch becaouse it
                // logs to stderr, not stdout
                if (responseText === '') {
                    reject(new Error('akasha-core produced no output (see server stderr)'));
                } else {
                    resolve(responseText);
                }
            }
            function onExit(code: number | null) {
                state.child.stdout.off('data', onData);
                reject(new Error(`akasha-core exited (code ${code}) before responding`));
            }

            state.child.stdout.on('data', onData);
            state.child.once('exit', onExit);
            state.child.stdin.write(encodeForStdin(prompt) + '\n');
        });
    });

    // Swallow rejections here so one failed turn doesn't wedge the queue for
    // the next caller; the real error still propagates via the returned
    // `run` promise below.
    state.queue = run.catch(() => undefined);
    return run;
}

function llmInferencePlugin(): Plugin {
    return {
        name: 'llm-inference',
        configureServer(server) {
            server.middlewares.use('/api/llm-generate', (req, res) => {
                if (req.method !== 'POST') {
                    res.statusCode = 405;
                    res.end();
                    return;
                }

                const chunks: Buffer[] = [];
                req.on('data', (chunk) => chunks.push(chunk));
                req.on('end', async () => {
                    try {
                        const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
                        const prompt = typeof body.prompt === 'string' ? body.prompt : '';
                        if (!prompt.trim()) {
                            res.statusCode = 400;
                            res.end();
                            return;
                        }

                        const text = await generate(prompt);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ text }));
                    } catch (err) {
                        console.error('[llm-inference]', err);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: String(err) }));
                    }
                });
            });
        },
    };
}

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
    plugins: [react(), saveLlmInputPlugin(), llmInferencePlugin()],
    // Binds to 0.0.0.0 instead of just localhost, so a phone on the same
    // Wi-Fi can open the dev server at the computer's LAN IP (printed in
    // the terminal as "Network:" when `npm run dev` starts).
    server: {
        host: true,
    },
});
