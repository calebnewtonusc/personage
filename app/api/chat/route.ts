import { NextRequest } from 'next/server';
import { getSystemPrompt } from '@/lib/system-prompt';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'https://ollama.com';
const OLLAMA_MODEL    = process.env.OLLAMA_MODEL    || 'gemma3:4b';
const OLLAMA_API_KEY  = process.env.OLLAMA_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const ollamaMessages = [
      { role: 'system', content: getSystemPrompt() },
      ...messages,
    ];

    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(OLLAMA_API_KEY && { Authorization: `Bearer ${OLLAMA_API_KEY}` }),
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: ollamaMessages,
        stream: true,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error('Ollama error:', errorText);
      return Response.json(
        { error: `Ollama returned ${ollamaResponse.status}: ${ollamaResponse.statusText}` },
        { status: 502 }
      );
    }

    // Parse OpenAI-compatible SSE stream: "data: {...}\n\n"
    const stream = new ReadableStream({
      async start(controller) {
        const reader  = ollamaResponse.body!.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text  = decoder.decode(value, { stream: true });
            const lines = text.split('\n').filter(Boolean);

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const data = line.slice(6).trim();
              if (data === '[DONE]') continue;
              try {
                const parsed  = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) controller.enqueue(new TextEncoder().encode(content));
              } catch {
                // skip malformed lines
              }
            }
          }
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Failed to reach AI model. Make sure OLLAMA_BASE_URL is configured correctly.' },
      { status: 500 }
    );
  }
}
