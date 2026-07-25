from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Dict
from pydantic import BaseModel
from app.services.document_processor import document_processor
from app.services.rag_engine import rag_engine
import os
import shutil
from app.core.config import settings

router = APIRouter()

class QueryRequest(BaseModel):
    query: str
    chat_history: List[Dict[str, str]] = []

class QueryResponse(BaseModel):
    answer: str
    sources: List[Dict[str, str]]

@router.post("/upload")
async def upload_pdfs(files: List[UploadFile] = File(...)):
    """Uploads PDFs and indexes them."""
    uploaded_paths = []
    try:
        for file in files:
            if not file.filename.endswith(".pdf"):
                raise HTTPException(status_code=400, detail=f"File {file.filename} is not a PDF.")

            file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            uploaded_paths.append(file_path)

        # Process and Index
        chunks = document_processor.process_pdfs(uploaded_paths)
        rag_engine.index_documents(chunks)

        return {
            "message": "Files processed successfully",
            "files_indexed": [os.path.basename(p) for p in uploaded_paths],
            "total_chunks": len(chunks)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/documents")
async def list_documents():
    """Lists all uploaded documents."""
    files = os.listdir(settings.UPLOAD_DIR) if os.path.exists(settings.UPLOAD_DIR) else []
    return {"documents": [f for f in files if f.endswith(".pdf")]}

@router.delete("/documents/clear")
async def clear_documents():
    """Clears all indexed documents."""
    rag_engine.clear_index()
    if os.path.exists(settings.UPLOAD_DIR):
        shutil.rmtree(settings.UPLOAD_DIR)
        os.makedirs(settings.UPLOAD_DIR)
    return {"message": "All documents cleared successfully"}

@router.post("/query", response_model=QueryResponse)
async def query_rag(request: QueryRequest):
    """Retrieves answer from RAG engine."""
    try:
        answer, sources = rag_engine.query(request.query, request.chat_history)
        return QueryResponse(answer=answer, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/clear")
async def clear_chat():
    """Clears chat history (client-side primarily)."""
    return {"message": "Chat history cleared"}
