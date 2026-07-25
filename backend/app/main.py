from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router
from app.core.config import settings
import os
import uvicorn

app = FastAPI(title="Professional RAG App API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your Netlify domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to the RAG Application API. Use /docs for API documentation."}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # use Render's PORT
    uvicorn.run(app, host="0.0.0.0", port=port)

