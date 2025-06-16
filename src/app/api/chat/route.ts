// app/api/chat/route.ts
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { mistral } from '@ai-sdk/mistral';
import { google } from '@ai-sdk/google';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, modelId = 'gemma2-9b-it' } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400 }
      );
    }

    let model;

    // Choose model based on modelId
    switch (modelId) {
      case 'gemma2-9b-it':
        model = groq(modelId);
        break;
      case 'mistral-large-latest':
        model = mistral(modelId);
        break;
      case 'gemini-1.5-flash':
        model = google(modelId);
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Model not supported' }),
          { status: 400 }
        );
    }

    const { text } = await generateText({
      model,
      prompt,
    });

    return new Response(text, {
      headers: { 'Content-Type': 'text/plain' },
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}