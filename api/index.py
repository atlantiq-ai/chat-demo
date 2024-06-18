from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator

# Initialize OpenAI client
client = OpenAI(api_key="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")

app = FastAPI()

# Define the request body schema
class GPTRequest(BaseModel):
    message: str

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/")
async def get_gpt_response(request: GPTRequest) -> StreamingResponse:
    stream = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": request.message}],
        stream=True,
    )

    async def event_generator() -> AsyncGenerator[str, None]:
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content

    return StreamingResponse(event_generator(), media_type="text/plain")

# New endpoint that returns "yes the button is working"
@app.get("/api/check")
async def check_button():
    return {"message": "yes the button is working"}
