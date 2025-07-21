import os
from fastapi import FastAPI, Request, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from openai import OpenAI

load_dotenv()
PASSWORD = os.environ["SITE_PASSWORD"]
ALLOWED_ORIGINS = os.environ["ALLOWED_ORIGINS"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGINS],
    allow_methods=["POST"],
    allow_headers=["*"]
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler) # type: ignore

client = OpenAI()

class ChatRequest(BaseModel):
    query: str

@app.post("/chat")
@limiter.limit("5/minute")
def chat(request: Request, body: ChatRequest, x_api_key: str = Header(None)):
    if x_api_key != PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")

    response = client.chat.completions.create(
        model="gpt-4.1-nano-2025-04-14",
        messages=[
            {
                "role": "user",
                "content": body.query
            }
        ]
    )

    reply = response.choices[0].message.content

    return {"response" : reply}

@app.get("/")
def HealthCheck():
    return {"response": "Healthy"}