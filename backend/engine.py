import random
from typing import Optional, List, Union
from models import StudentSignals, Intervention

class OrchestratorEngine:
    def __init__(self):
        self.history = []

    def process_signals(self, signals: StudentSignals) -> Optional[Intervention]:
        # 1. FATIGUE MANAGEMENT
        if signals.fatigue_probability > 0.7:
            return Intervention(
                type="break",
                title="Cognitive Recovery Break",
                reasoning="Fatigue probability exceeds critical threshold (0.7). Immediate recovery is required to prevent cognitive overload and maintain neural efficiency.",
                action="Recommend 5-minute recovery break."
            )
        
        if signals.session_time >= 30 and signals.fatigue_probability > 0.5:
            return Intervention(
                type="break",
                title="Cognitive Recovery Break",
                reasoning=f"Neural fatigue is accumulating ({signals.fatigue_probability:.2f}) after {signals.session_time} minutes of focused study. A short reset will facilitate memory consolidation.",
                action="Suggest hydration/stretch break."
            )

        # 2. PLATEAU INTERVENTION
        if signals.plateau_probability > 0.6:
            return Intervention(
                type="plateau_intervention",
                title="Plateau Intervention",
                reasoning="Learning plateau detected. Cognitive stimulation requires a shift in modality to re-engage active recall and prevent stagnation.",
                action="Switching to Active Recall / Problem-Solving mode.",
                questions=self.generate_quiz(signals, count=1, challenge=True)
            )

        # 3. MOCK TEST GENERATION (Topic Completion)
        if signals.topic_completion_status == "completed":
            return Intervention(
                type="mock",
                title="Adaptive Mini Mock",
                reasoning=f"Topic '{signals.topic}' marked as completed. Quantifying mastery through multi-layered assessment.",
                questions=self.generate_mock(signals)
            )

        # 4. ADAPTIVE QUIZ (Regular Reinforcement - Simplified Trigger for Demo)
        # In a real system, this might trigger after a video or periodic interval
        if random.random() < 0.1: # 10% chance per signal update to trigger a quiz if no other intervention
             return Intervention(
                type="quiz",
                title="Adaptive Knowledge Check",
                reasoning=f"Adaptive difficulty set to {signals.difficulty_score:.2f} based on current mastery.",
                questions=self.generate_quiz(signals)
            )

        return None

    def generate_quiz(self, signals: StudentSignals, count: int = 3, challenge: bool = False):
        questions = []
        difficulty = "Moderate"
        if signals.difficulty_score < 0.4: difficulty = "Easy"
        elif signals.difficulty_score > 0.7: difficulty = "Difficult"
        
        if challenge:
            difficulty = "High-Order Conceptual"

        for i in range(count):
            questions.append({
                "id": i+1,
                "text": f"Sample {difficulty} question for {signals.topic} (Difficulty Score: {signals.difficulty_score:.2f})",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "answer": "Option A"
            })
        return questions

    def generate_mock(self, signals: StudentSignals):
        # Distribution based on mastery
        count = 5
        questions = []
        # Simplified distribution logic
        levels = ["Easy", "Moderate", "Difficult"]
        for i in range(count):
            level = random.choice(levels)
            questions.append({
                "id": i+1,
                "level": level,
                "text": f"Mock {level} question for {signals.topic}",
                "options": ["A", "B", "C", "D"],
                "answer": "A"
            })
        return questions
