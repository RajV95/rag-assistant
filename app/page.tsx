import DocumentUploader from '../components/DocumentUploader';
import ChatInterface from '../components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">🧠 RAG Document Assistant</h1>
          <p className="text-gray-600">
            Powered by Llama 3.2 3B • Running locally with Ollama
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Upload */}
          <div className="lg:col-span-1">
            <DocumentUploader />
          </div>

          {/* Right: Chat */}
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>
        </div>
      </div>
    </main>
  );
}
