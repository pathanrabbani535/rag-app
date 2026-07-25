import os
from typing import List
from pypdf import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.core.config import settings

class DocumentProcessor:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            length_function=len,
            is_separator_regex=False,
        )

    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extracts all text from a given PDF file."""
        text = ""
        try:
            reader = PdfReader(pdf_path)
            for page in reader.pages:
                content = page.extract_text()
                if content:
                    text += content + "\n"
        except Exception as e:
            print(f"Error extracting text from {pdf_path}: {e}")
            raise e
        return text

    def create_chunks(self, text: str, metadata: dict) -> List[dict]:
        """Splits text into chunks and attaches metadata to each."""
        chunks = self.text_splitter.split_text(text)
        return [{"text": chunk, "metadata": metadata} for chunk in chunks]

    def process_pdfs(self, file_paths: List[str]) -> List[dict]:
        """Processes multiple PDFs into a list of chunks with metadata."""
        all_chunks = []
        for path in file_paths:
            filename = os.path.basename(path)
            text = self.extract_text_from_pdf(path)
            metadata = {"source": filename}
            chunks = self.create_chunks(text, metadata)
            all_chunks.extend(chunks)
        return all_chunks

document_processor = DocumentProcessor()
