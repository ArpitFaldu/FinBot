import { NextResponse } from 'next/server';
import pineconeIndex from '../../lib/ai/pinecone.js';
import { getEmbedding, askLLM } from '../../lib/ai/utils.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const question = searchParams.get('query');

  if (!question) {
    return NextResponse.json(
      { error: 'Provide a query using ?query=...' },
      { status: 400 }
    );
  }

  try {
    const embedding = await getEmbedding(question);
    const searchResults = await pineconeIndex.query({
      topK: 1,
      vector: embedding,
      includeMetadata: true,
    });

    const topMatch = searchResults.matches?.[0];
    if (!topMatch) {
      return NextResponse.json(
        { error: 'No relevant documents found.' },
        { status: 404 }
      );
    }

    const answer = await askLLM(topMatch.metadata.content, question);
    return NextResponse.json({
      question,
      answer,
      context: topMatch.metadata.content
    });
    
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Missing query in request body' },
        { status: 400 }
      );
    }

    const embedding = await getEmbedding(query);
    const searchResults = await pineconeIndex.query({
      topK: 1,
      vector: embedding,
      includeMetadata: true,
    });

    const topMatch = searchResults.matches?.[0];
    if (!topMatch) {
      return NextResponse.json(
        { error: 'No relevant documents found.' },
        { status: 404 }
      );
    }

    const answer = await askLLM(topMatch.metadata.content, query);
    return NextResponse.json({
      question: query,
      answer,
      context: topMatch.metadata.content
    });
    
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}