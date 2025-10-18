'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ content: string; metadata: any }>;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Query failed');
      }

      // Add assistant message
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: data.answer,
          sources: data.sources,
        },
      ]);

    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: `Error: ${err.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-t-lg">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">👋 Upload a document and ask me anything!</p>
            <p className="text-sm mt-2">I'll answer based on the content you upload.</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i}>
              <Card className={msg.role === 'user' ? 'bg-blue-50' : 'bg-white'}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <Badge variant={msg.role === 'user' ? 'default' : 'secondary'}>
                      {msg.role === 'user' ? '👤 You' : '🤖 AI'}
                    </Badge>
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      
                      {/* Show sources */}
                      {msg.sources && msg.sources.length > 0 && (
                        <details className="mt-3 text-sm">
                          <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                            📚 View {msg.sources.length} source(s)
                          </summary>
                          <div className="mt-2 space-y-2">
                            {msg.sources.map((source, j) => (
                              <div key={j} className="p-2 bg-gray-100 rounded text-xs">
                                <p className="font-semibold">
                                  {source.metadata.fileName || 'Unknown'}
                                </p>
                                <p className="text-gray-600 mt-1">{source.content}</p>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        )}

        {loading && (
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">🤖 AI</Badge>
                <span className="text-gray-500">Thinking...</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t rounded-b-lg">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
