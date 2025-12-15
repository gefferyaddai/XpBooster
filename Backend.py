from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uuid
import os
from openai import OpenAI
from dotenv import load_dotenv
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ObjectiveRequest(BaseModel):
    goal: str
    difficulty: str  # "Easy" | "Medium" | "Hard"

class Objective(BaseModel):
    id: str
    index: int
    text: str

class PostOut(BaseModel):
    goal: str
    difficulty: str
    objectives: list[Objective]

DIFFICULTY_MAP = {
    "Easy": 15,
    "Medium": 30,
    "Hard": 50,
}

# ---------- OpenAI client ----------
load_dotenv(".ENV")  # or ".env" if that's your file name
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.post("/generate-objectives", response_model=PostOut)
def generateObjectives(payload: ObjectiveRequest):
    goal = payload.goal.strip()
    difficulty = payload.difficulty
    count = DIFFICULTY_MAP.get(difficulty, 15)

    system_prompt = (
        "You are an assistant that generates clear, concrete objectives for users' goals. "
        "Each objective must be specific, actionable in real life, and verifiable via either "
        "a photo/image, a short voice recording, or a text explanation."
    )

    user_prompt = f"""
Goal: "{goal}"
Difficulty: {difficulty}
Number of objectives: {count}

Generate exactly {count} numbered objectives that:
- Clearly relate to the goal.
- each objective should bring the user closer to achieving the goal.
- after completing all objectives the user must be able to say they have completed their goal
- Can each be proven by at least ONE of:
  - a photo (image proof),
  - a short voice recording (audio proof),
  - or a short written explanation (text proof).

Return ONLY valid JSON:
{{
  "objectives": [
    "objective 1 text",
    "objective 2 text",
    ...
  ]
}}
Do NOT include any extra text or explanation outside the JSON.
    """.strip()


    response = client.responses.create(
        model="gpt-4o-mini",
        input=f"{system_prompt}\n\n{user_prompt}",
    )


    raw_output = response.output_text  # this is a string


    parsed = json.loads(raw_output)
    objective_texts = parsed.get("objectives", [])

    if len(objective_texts) < count:
        for i in range(len(objective_texts), count):
            objective_texts.append(f"Extra objective {i+1} related to: {goal}")

    objectives: list[Objective] = []
    for i, text in enumerate(objective_texts[:count]):
        objectives.append(
            Objective(
                id=str(uuid.uuid4()),
                index=i + 1,
                text=text,
            )
        )

    return PostOut(
        goal=goal,
        difficulty=difficulty,
        objectives=objectives,
    )
