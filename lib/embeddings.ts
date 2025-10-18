import { OllamaEmbeddings } from "@langchain/ollama";

export function getEmbeddings() {
  return new OllamaEmbeddings({
    model: "nomic-embed-text",
    baseUrl: "http://localhost:11434",
  });
}
