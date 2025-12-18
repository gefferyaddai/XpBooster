from platform import system

from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uuid
import base64, os, json
from openai import OpenAI
from dotenv import load_dotenv
from typing import cast, Any


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

class out(BaseModel):
    status: bool

class photoRequest(BaseModel):
    photo: str
# ---------- OpenAI client ----------
load_dotenv(".env")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.post("/generate-objectives", response_model=PostOut)
def generateObjectives(payload: ObjectiveRequest):
    goal = payload.goal.strip()
    difficulty = payload.difficulty
    count = DIFFICULTY_MAP.get(difficulty, 15)

    system_prompt = """
You generate step-by-step objective plans.

Rules:
- Objectives must be concrete, real-world, and verifiable.
- Each objective must build on the previous one (no jumps).
- Keep objectives short (1–2 sentences).
- Provide exactly one proof method per objective: photo .
- Proof must be specific (what to capture) and hard to fake.
- Avoid unsafe, illegal, or unethical instructions. If the goal is unsafe/illegal, return objectives that steer toward a safe/legal alternative.
"""

    user_prompt = f"""
Goal: "{goal}"
Difficulty: {difficulty}
Number of objectives: {count}

Generate exactly {count} numbered objectives that:
- Clearly relate to the goal.
- each objective should bring the user closer to achieving the goal.
- each objective must build off of the last objective
- after completing all objectives the user must be able to say they have completed their goal
- each objective can be proven by a photo (image proof)
- include what proof the user should input at the end of each objective,

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
class VerifyOut(BaseModel):
    status: bool
    reason: str

@app.post("/verify-proof", response_model=VerifyOut)
async def verify_proof(
        file: UploadFile = File(...),
        proof_requirement: str = Form(...)
):
    # 1) read bytes
    img_bytes = await file.read()

    # 2) convert to base64 data URL
    b64 = base64.b64encode(img_bytes).decode("utf-8")
    data_url = f"data:{file.content_type};base64,{b64}"

    # 3) ask OpenAI (force a strict JSON output)
    system_prompt = (
        "You are a strict proof verifier. "
        "You must decide if the image satisfies the proof requirement. "
        "If uncertain, return false."
    )

    user_prompt = f"""
Proof requirement:
{proof_requirement}

Decide if the image matches the requirement.
Return JSON only with:
{{"status": true/false, "reason": "one short sentence"}}
"""

    resp = client.responses.create(
        model="gpt-4o-mini",
        input=[
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": user_prompt},
                    {"type": "input_image", "image_url": data_url},
                ],
            },
        ],
    )




    # 4) parse response JSON
    try:
        out = json.loads(resp.output_text)
        return VerifyOut(status=bool(out["status"]), reason=str(out["reason"]))
    except Exception:
        # fallback if model output isn't valid JSON
        return VerifyOut(status=False, reason="Could not parse verification result.")
