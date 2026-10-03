"""Laya decision backend for Oracle VM. Real Laya choice inference, no stubs."""
from __future__ import annotations
import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

MODEL_ID = os.environ.get("LAYA_MODEL", "convaiinnovations/laya")

app = FastAPI(title="Laya Decision API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.uptools.in", "https://uptools.in", "http://localhost:5173", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_agent = None

def get_agent():
    global _agent
    if _agent is None:
        import laya
        _agent = laya.Agent(model_id_or_path=MODEL_ID)
    return _agent

class DecideIn(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    choices: List[str] = Field(min_length=2, max_length=32)
    state: Optional[str] = None

@app.get("/health")
def health():
    return {"ok": True, "model": MODEL_ID, "loaded": _agent is not None}

@app.post("/decide")
def decide(body: DecideIn):
    choices = [c.strip() for c in body.choices if c and c.strip()]
    if len(choices) < 2:
        raise HTTPException(422, "send at least 2 non-empty choices")
    if len(choices) > 32:
        raise HTTPException(422, "max 32 choices (Laya limit)")
    try:
        import laya
        agent = get_agent()
        state = body.state or body.question
        q = {"pick": {"type": "choice",
                      "instructions": "Pick the best option for: " + body.question.strip(),
                      "criteria": choices}}
        res = laya.decide(agent, state, questions=q, return_details=True)
        probs = dict(res.probabilities.get("pick", {}))
        pick = res.values["pick"]["choice"] if isinstance(res.values.get("pick"), dict) else res.values.get("pick")
        conf = res.answer_confidence.get("pick")
        return {"pick": pick, "probabilities": probs, "confidence": conf, "model": MODEL_ID}
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(422, str(e))
    except Exception as e:
        raise HTTPException(500, "inference failed: " + str(e)[:400])
