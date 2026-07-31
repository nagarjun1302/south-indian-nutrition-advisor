"""
FastAPI Backend for South Indian Nutrition Advisor
Run with: uvicorn api:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import traceback

# Import your existing advisor
from backend.nutrition_advisor import analyze_patient_meal

app = FastAPI(
    title="South Indian Nutrition Advisor API",
    description="AI-powered nutrition analysis using Google Gemini + LangGraph",
    version="1.0.0"
)

# ─── CORS (allow frontend to call this API) ───────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── SCHEMAS ─────────────────────────────────────────
class FoodItem(BaseModel):
    name: str
    quantity: str = "1 serving"

class AnalyzeRequest(BaseModel):
    patient_id: str = "P001"
    patient_name: str = "Patient"
    food_items: List[FoodItem]
    medical_conditions: List[str] = []
    meal_time: str = "lunch"             # breakfast | lunch | dinner | snack
    patient_email: Optional[str] = None
    patient_phone: Optional[str] = None

class AnalyzeResponse(BaseModel):
    patient_id: str
    patient_name: str
    meal_time: str
    nutritional_breakdown: dict
    detailed_recommendations: list
    ingredient_modifications: dict
    final_report: str
    message_sent: bool
    positive_notes: list = []
    general_tips: list = []

# ─── ROUTES ──────────────────────────────────────────

@app.get("/health")
def health_check():
    """Health check endpoint — used by the frontend to test connection."""
    return {"status": "ok", "service": "South Indian Nutrition Advisor"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    """
    Main endpoint: accepts meal data, runs the LangGraph + Gemini pipeline,
    and returns the full nutrition analysis with personalized recommendations.
    """
    try:
        # Convert Pydantic models to plain dicts expected by nutrition_advisor
        food_items = [{"name": f.name, "quantity": f.quantity} for f in req.food_items]

        result = analyze_patient_meal(
            patient_id=req.patient_id,
            patient_name=req.patient_name,
            food_items=food_items,
            medical_conditions=req.medical_conditions,
            meal_time=req.meal_time,
            patient_email=req.patient_email,
            patient_phone=req.patient_phone,
        )

        return AnalyzeResponse(
            patient_id=result.get("patient_id", req.patient_id),
            patient_name=result.get("patient_name", req.patient_name),
            meal_time=result.get("meal_time", req.meal_time),
            nutritional_breakdown=result.get("nutritional_breakdown", {}),
            detailed_recommendations=result.get("detailed_recommendations", []),
            ingredient_modifications=result.get("ingredient_modifications", {}),
            final_report=result.get("final_report", ""),
            message_sent=result.get("message_sent", False),
            positive_notes=result.get("positive_notes", []),
            general_tips=result.get("general_tips", []),
        )

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def root():
    return {
        "message": "South Indian Nutrition Advisor API",
        "docs": "/docs",
        "health": "/health",
        "analyze": "POST /analyze"
    }
