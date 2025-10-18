# 🧠 RAG Document Assistant

A powerful Retrieval-Augmented Generation (RAG) application that allows you to upload documents and ask questions about their content using local AI models. Built with Next.js, LangChain, and ChromaDB.

## ✨ Features

- **Document Upload**: Support for PDF and TXT files
- **Local AI Processing**: Uses Ollama with Llama 3.2 3B model (runs completely offline)
- **Intelligent Chunking**: Automatically splits documents into optimal chunks for better retrieval
- **Source Citations**: Every answer includes references to the source documents
- **Modern UI**: Clean, responsive interface built with Tailwind CSS and shadcn/ui
- **Real-time Chat**: Interactive chat interface for querying your documents

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Ollama** installed and running locally
3. **ChromaDB** server running locally

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rag-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Ollama and pull required models**
   ```bash
   # Start Ollama (if not already running)
   ollama serve

   # Pull the Llama 3.2 3B model
   ollama pull llama3.2

   # Pull the embedding model
   ollama pull nomic-embed-text
   ```

4. **Start ChromaDB server**
   ```bash
   # Install ChromaDB (if not already installed)
   pip install chromadb

   # Start ChromaDB server
   chroma run --host localhost --port 8000
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How It Works

### Architecture Overview

The RAG Document Assistant follows a three-stage pipeline:

1. **Document Processing**
   - Upload PDF or TXT files through the web interface
   - Extract text content using specialized loaders
   - Split documents into chunks (1000 characters with 200 character overlap)
   - Generate embeddings using Ollama's `nomic-embed-text` model
   - Store chunks and embeddings in ChromaDB vector database

2. **Query Processing**
   - User submits a question through the chat interface
   - Generate embeddings for the question
   - Retrieve top 4 most relevant document chunks from ChromaDB
   - Send question + retrieved context to Llama 3.2 3B model
   - Generate answer based only on provided context

3. **Response Generation**
   - AI generates factual answers grounded in document content
   - Includes source citations showing which parts of documents were referenced
   - Maintains conversation history in the chat interface

### Key Components

- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **UI Components**: shadcn/ui component library
- **Backend**: Next.js API routes for document upload and querying
- **Vector Database**: ChromaDB for efficient similarity search
- **Embeddings**: Ollama `nomic-embed-text` model (local, offline)
- **LLM**: Ollama Llama 3.2 3B model (local, offline)
- **Document Processing**: LangChain document loaders and text splitters

## 🛠️ Technologies Used

### Core Framework
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript

### AI/ML Stack
- **LangChain** - Framework for building LLM applications
- **Ollama** - Local LLM and embedding model server
- **ChromaDB** - Vector database for embeddings
- **Llama 3.2 3B** - Language model for answer generation
- **nomic-embed-text** - Embedding model for text similarity

### Document Processing
- **PDFLoader** - Extract text from PDF files
- **TextLoader** - Load plain text files
- **RecursiveCharacterTextSplitter** - Intelligent text chunking

### UI/UX
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icons
- **Radix UI** - Accessible UI primitives

## 📁 Project Structure

```
rag-assistant/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── query/         # Query API endpoint
│   │   └── upload/        # Document upload endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── ChatInterface.tsx # Chat component
│   └── DocumentUploader.tsx # File upload component
├── lib/                  # Utility libraries
│   ├── embeddings.ts     # Embedding model setup
│   ├── rag-chain.ts      # RAG pipeline logic
│   ├── utils.ts          # Helper functions
│   └── vectorstore.ts    # ChromaDB configuration
├── chroma/               # ChromaDB data directory
├── public/uploads/       # Uploaded document storage
└── package.json          # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

The application uses default configurations but can be customized:

- **Ollama Base URL**: `http://localhost:11434` (configurable in `lib/embeddings.ts` and `lib/rag-chain.ts`)
- **ChromaDB URL**: `http://localhost:8000` (configurable in `lib/vectorstore.ts`)
- **Chunk Size**: 1000 characters (configurable in `app/api/upload/route.ts`)
- **Chunk Overlap**: 200 characters (configurable in `app/api/upload/route.ts`)
- **Retrieval K**: 4 documents (configurable in `lib/rag-chain.ts`)

### Model Configuration

- **LLM Model**: `llama3.2` (3B parameter model)
- **Embedding Model**: `nomic-embed-text`
- **Temperature**: 0.2 (for consistent, factual answers)

## 🚀 Deployment

### Local Development
Follow the Quick Start guide above.

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

### Docker Deployment (Optional)

You can containerize the application:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- **Meta** for Llama models
- **LangChain** for the RAG framework
- **Chroma** for the vector database
- **Ollama** for local AI model serving
- **Vercel** for Next.js and deployment inspiration

## 🔍 Troubleshooting

### Common Issues

1. **Ollama connection errors**
   - Ensure Ollama is running: `ollama serve`
   - Check model is pulled: `ollama list`
   - Verify base URL in configuration

2. **ChromaDB connection errors**
   - Start ChromaDB: `chroma run --host localhost --port 8000`
   - Check port availability

3. **Document upload failures**
   - Check file size limits
   - Ensure supported file types (PDF/TXT)
   - Verify write permissions for `public/uploads/`

4. **Slow responses**
   - First query may be slower due to model loading
   - Subsequent queries should be faster
   - Consider using smaller chunk sizes for better performance

### Performance Tips

- Use smaller chunk sizes for faster retrieval
- Limit retrieval to fewer documents (k=3 instead of k=4)
- Ensure sufficient RAM for Ollama models
- Use SSD storage for ChromaDB data

---

Built with using Next.js, LangChain, and local AI models.
