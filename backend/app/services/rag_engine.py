import os
from typing import List, Tuple
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from app.core.config import settings

class RAGEngine:
    def __init__(self):
        # Initialize embeddings model (all-MiniLM-L6-v2)
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.vector_store = None
        self.llm = ChatOpenAI(model="gpt-4o", openai_api_key=settings.OPENAI_API_KEY)
        self._load_index()

    def _load_index(self):
        """Loads the FAISS index from disk if it exists."""
        if os.path.exists(settings.FAISS_INDEX_PATH):
            self.vector_store = FAISS.load_local(
                settings.FAISS_INDEX_PATH,
                self.embeddings,
                allow_dangerous_deserialization=True
            )

    def index_documents(self, chunks: List[dict]):
        """Indexes document chunks into FAISS and saves to disk."""
        texts = [c["text"] for c in chunks]
        metadatas = [c["metadata"] for c in chunks]

        if self.vector_store is None:
            self.vector_store = FAISS.from_texts(texts, self.embeddings, metadatas=metadatas)
        else:
            self.vector_store.add_texts(texts, metadatas=metadatas)

        self.vector_store.save_local(settings.FAISS_INDEX_PATH)

    def query(self, question: str, chat_history: List = None) -> Tuple[str, List[dict]]:
        """Retrieves context and generates an answer."""
        if self.vector_store is None:
            return "No documents indexed. Please upload some PDFs first.", []

        # 1. Retrieve relevant chunks
        docs = self.vector_store.similarity_search(question, k=settings.TOP_K)

        # 2. Construct context
        context = "\n\n".join([f"Source: {d.metadata['source']}\nContent: {d.page_content}" for d in docs])

        # 3. Build Prompt
        prompt_template = """
        You are a professional AI assistant. Use the provided context to answer the user's question.
        If the answer is not contained within the context, politely state that you don't know based on the provided documents.
        Always cite the document name when referring to information.

        Context:
        {context}

        Chat History:
        {history}

        Question: {question}
        Answer:
        """

        history_str = "\n".join([f"{m['role']}: {m['content']}" for m in (chat_history or [])])
        final_prompt = prompt_template.format(
            context=context,
            history=history_str,
            question=question
        )

        # 4. Generate Answer
        response = self.llm.invoke(final_prompt)

        # 5. Format sources for UI
        sources = [{"document": d.metadata['source'], "text": d.page_content} for d in docs]

        return response.content, sources

    def clear_index(self):
        """Deletes the local FAISS index."""
        if os.path.exists(settings.FAISS_INDEX_PATH):
            import shutil
            shutil.rmtree(settings.FAISS_INDEX_PATH)
        self.vector_store = None

rag_engine = RAGEngine()
