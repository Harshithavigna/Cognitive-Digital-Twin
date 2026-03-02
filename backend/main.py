from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from engine import OrchestratorEngine
from models import StudentSignals, Intervention
from simulator import simulate_student
import json

app = FastAPI()
engine = OrchestratorEngine()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        # Start the simulator for this session
        await simulate_student(websocket)
    except WebSocketDisconnect:
        print("Client disconnected")

@app.post("/doubt")
async def resolve_doubt(query: dict):
    # Normalize input for greeting detection
    text = query.get('text', '').lower().strip()
    greetings = ['hi', 'hello', 'hey', 'hola', 'yo']
    
    if text in greetings:
        return {
            "final_answer": "Hi! Cognitive Link established. What is the problem or concept you need assistance with?",
            "explanation": None,
            "recap": "Awaiting your technical query to initiate a deep-dive analysis."
        }

    # Prompt logic for Doubt Resolution
    concept = query.get('text', 'Concept')
    response = {
        "title": "Step-by-Step Concept Breakdown",
        "explanation": [
            f"1. Analyzing the core concept of {concept}.",
            "2. Applying fundamental cognitive principles to derive the relationship.",
            "3. Synthesizing the final result through rigorous analytical deduction."
        ],
        "final_answer": f"The comprehensive understanding of {concept} is established based on the derivation above.",
        "recap": "Always remember the foundational laws governing this concept to ensure long-term retention."
    }
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
