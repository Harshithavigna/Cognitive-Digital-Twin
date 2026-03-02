import asyncio
import random
import json
from models import StudentSignals

async def simulate_student(websocket):
    student_name = "Alex"
    subject = "Quantum Physics"
    topic = "Wave-Particle Duality"
    session_time = 0
    
    # Starting state
    accuracy = 0.8
    retention = 0.9
    fatigue = 0.1
    plateau = 0.1
    mastery = 0.4
    difficulty = 0.5
    volatility = 0.2
    
    while True:
        await asyncio.sleep(3) # Update every 3 seconds
        
        session_time += 1
        # Randomly drift signals to simulate a session
        fatigue = min(1.0, fatigue + random.uniform(0.01, 0.05))
        accuracy = max(0.0, min(1.0, accuracy + random.uniform(-0.1, 0.1)))
        retention = max(0.0, min(1.0, retention - random.uniform(0.0, 0.02)))
        
        # Simulate plateau after some time
        if session_time > 15:
            plateau = min(1.0, plateau + random.uniform(0.0, 0.1))
            
        signals = StudentSignals(
            student_name=student_name,
            subject=subject,
            topic=topic,
            session_time=session_time,
            accuracy_percent=accuracy * 100,
            retention_probability=retention,
            fatigue_probability=fatigue,
            plateau_probability=plateau,
            mastery_score=mastery,
            difficulty_score=difficulty,
            volatility_score=volatility,
            topic_completion_status="in_progress" if session_time < 30 else "completed",
            peers_available=random.choice([True, False])
        )
        
        await websocket.send_text(signals.model_dump_json())
        
        if session_time >= 40: # Reset for demo
            session_time = 0
            fatigue = 0.1
            plateau = 0.1
