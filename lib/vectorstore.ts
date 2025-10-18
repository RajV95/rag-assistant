import { Chroma } from "@langchain/community/vectorstores/chroma";
import { getEmbeddings } from "./embeddings";

export async function getVectorStore() {
  const embeddings = getEmbeddings();
  
  return new Chroma(embeddings, {
    collectionName: "rag_documents",
    url: "http://localhost:8000",
  });
}
