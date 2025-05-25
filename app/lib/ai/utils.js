import bedrockClient from './bedrock';
import pineconeIndex from './pinecone';
import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export async function getEmbedding(text) {
  const input = { inputText: text };
  const command = new InvokeModelCommand({
    modelId: 'amazon.titan-embed-text-v2:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: Buffer.from(JSON.stringify(input)),
  });

  const response = await bedrockClient.send(command);
  const result = JSON.parse(Buffer.from(response.body).toString('utf-8'));
  return result.embedding;
}

export async function askLLM(context, question) {
  const prompt = `Use the following context to answer the question:\n\nContext:\n${context}\n\nQuestion:\n${question}\n\nAnswer:`;

  const input = {
    anthropic_version: "bedrock-2023-05-31",
    messages: [{
      role: "user",
      content: [{ type: "text", text: prompt }]
    }],
    max_tokens: 300,
    temperature: 0.7,
    top_p: 1,
    top_k: 0
  };

  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: Buffer.from(JSON.stringify(input)),
  });

  const response = await bedrockClient.send(command);
  const result = JSON.parse(Buffer.from(response.body).toString('utf-8'));
  return result.content?.find(c => c.type === 'text')?.text || '❌ No response from Claude.';
}