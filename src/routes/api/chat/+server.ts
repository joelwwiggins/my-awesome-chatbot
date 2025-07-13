import { json } from '@sveltejs/kit';
import { streamText, tool } from 'ai';
import { createXAI } from '@ai-sdk/xai';
import { fetchEiaData } from '$lib/eia';
import { buildContextProtocol } from '$lib/prompt';
import { XAI_API_KEY } from '$env/static/private';
import { z } from 'zod';

const xai = createXAI({ apiKey: XAI_API_KEY });

export async function POST({ request }) {
  const { messages } = await request.json(); 
  const userMsg = messages.find((m: any) => m.role === 'user')?.content || '';
  // simple mapping; extend as needed
  const metric = userMsg.includes('gasoline export') ? 'gasoline_exports' : 'unknown';
  const seriesId = metric === 'gasoline_exports'
    ? 'PET.W_EPOOXE_SAE_NUS_MBBLD.W'
    : 'PET.W_SOME_OTHER'; 
  const definitions = 'Gasoline export volume: U.S. exports of finished motor gasoline in thousand barrels per day.';
  const data = await fetchEiaData(seriesId);
  const systemPrompt = buildContextProtocol(userMsg, metric, data, definitions);

  const response = await streamText({
    model: xai('grok-4'),
    system: systemPrompt,
    messages: []
  });

  return response.toDataStreamResponse();
}
