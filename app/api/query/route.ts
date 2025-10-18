import { NextRequest, NextResponse } from 'next/server';
import { queryRAG } from '@/lib/rag-chain';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    
    if (!question) {
      return NextResponse.json(
        { error: 'No question provided' },
        { status: 400 }
      );
    }

    console.log('Processing question:', question);

    const result = await queryRAG(question);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Query error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process query' },
      { status: 500 }
    );
  }
}
