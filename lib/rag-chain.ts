import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { getVectorStore } from "./vectorstore";
import { RunnableSequence } from "@langchain/core/runnables";

export async function queryRAG(question: string) {
  // 1. Get vector store and create retriever
  const vectorStore = await getVectorStore();
  const retriever = vectorStore.asRetriever({ 
    k: 4,  // Retrieve top 4 most relevant chunks
  });
  
  // 2. Retrieve relevant documents
  const relevantDocs = await retriever.invoke(question);
  
  // 3. Format context from retrieved documents
  const context = relevantDocs
    .map((doc, i) => `[${i + 1}] ${doc.pageContent}`)
    .join("\n\n");
  
  console.log(`Retrieved ${relevantDocs.length} documents`);
  
  // 4. Create prompt template
  const prompt = ChatPromptTemplate.fromTemplate(`
You are a helpful AI assistant. Answer the question based ONLY on the context provided below.
If you cannot answer based on the context, say "I don't have enough information to answer that."

Context:
{context}

Question: {question}

Answer:`);
  
  // 5. Initialize Llama 3.2 3B model
  const llm = new ChatOllama({
    model: "llama3.2",
    temperature: 0.2,  // Low temperature for factual answers
    baseUrl: "http://localhost:11434",
  });
  
  // 6. Create and run chain
  const chain = RunnableSequence.from([
    prompt,
    llm,
    new StringOutputParser(),
  ]);
  
  const answer = await chain.invoke({
    context,
    question,
  });
  
  return { 
    answer,
    sources: relevantDocs.map(doc => ({
      content: doc.pageContent.substring(0, 200) + "...",
      metadata: doc.metadata,
    })),
  };
}
