from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"]
)

class ChatResponse(BaseModel):
    query: str

@app.post("/chat")
def Chat(response: ChatResponse):
    return {"response": f"You pinged the API with: {response.query}"}

@app.get("/")
def HealthCheck():
    return {"response": "Healthy"}