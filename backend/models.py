from pydantic import BaseModel
from typing import Optional, List

class StudentSignals(BaseModel):
    student_name: str
    subject: str
    topic: str
    session_time: int  # minutes
    accuracy_percent: float
    retention_probability: float
    fatigue_probability: float
    plateau_probability: float
    mastery_score: float
    difficulty_score: float
    volatility_score: float
    topic_completion_status: str  # 'in_progress' or 'completed'
    peers_available: bool

class Intervention(BaseModel):
    type: str  # 'quiz', 'break', 'plateau_intervention', 'mock', 'analytics'
    title: str
    content: str
    questions: Optional[List[dict]] = None
    reasoning: Optional[str] = None
    action: Optional[str] = None
