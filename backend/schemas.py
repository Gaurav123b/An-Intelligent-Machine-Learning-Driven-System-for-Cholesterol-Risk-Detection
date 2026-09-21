from pydantic import BaseModel
from typing import Literal

class PatientData(BaseModel):
    age: float
    resting_bp_systolic: float
    resting_bp_diastolic: float
    cholesterol_total: float
    hdl: float
    ldl: float
    triglycerides: float
    fasting_blood_sugar: float
    hba1c: float
    bmi: float
    resting_heart_rate: float
    max_heart_rate_achieved: float
    exercise_induced_angina: int
    st_depression: float
    family_history: int
    alcohol_units_per_week: float
    exercise_minutes_per_week: float
    sleep_hours: float
    stress_score: float
    wearable_owner: int
    daily_steps: float
    diet_quality_score: float
    sex: str  # 'Male', 'Female'
    chest_pain_type: str  # 'Atypical Angina', 'Non-Anginal Pain', 'Typical Angina', 'Asymptomatic'
    smoker_status: str  # 'Former', 'Never', 'Current'

class PredictionResponse(BaseModel):
    prediction: int  # 0 or 1
    probability: float
    risk_level: str
