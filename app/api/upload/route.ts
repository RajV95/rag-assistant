import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getVectorStore } from '@/lib/vectorstore';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.log('Processing file:', file.name);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadsDir, file.name);
    await writeFile(filePath, buffer);

    console.log('File saved to:', filePath);

    // Load document based on file type
    let docs;
    if (file.name.endsWith('.pdf')) {
      const loader = new PDFLoader(filePath);
      docs = await loader.load();
    } else if (file.name.endsWith('.txt')) {
      const { TextLoader } = await import("langchain/document_loaders/fs/text");
      const loader = new TextLoader(filePath);
      docs = await loader.load();
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF or TXT' },
        { status: 400 }
      );
    }

    console.log(`Loaded ${docs.length} document(s)`);

    // Split documents into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,      // 1000 characters per chunk
      chunkOverlap: 200,    // 200 character overlap between chunks
    });

    const splits = await textSplitter.splitDocuments(docs);
    console.log(`Split into ${splits.length} chunks`);

    // Add metadata
    // splits.forEach((split, i) => {
    //   split.metadata = {
    //     ...split.metadata,
    //     fileName: file.name,
    //     chunkIndex: i,
    //     uploadedAt: new Date().toISOString(),
    //   };
    // });

    // Replace the metadata section with this minimal version
    splits.forEach((split, i) => {
      // Clear all existing metadata and only add what we need
      split.metadata = {
        fileName: file.name,
        chunkIndex: i,
        source: filePath,
      };
    });


    // Add to vector store
    const vectorStore = await getVectorStore();
    await vectorStore.addDocuments(splits);

    console.log('Documents indexed successfully');

    return NextResponse.json({
      success: true,
      fileName: file.name,
      chunks: splits.length,
      message: `Successfully processed ${file.name} into ${splits.length} chunks`,
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process document' },
      { status: 500 }
    );
  }
}
