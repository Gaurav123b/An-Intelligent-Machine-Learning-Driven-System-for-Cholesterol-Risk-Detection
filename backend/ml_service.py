import joblib
import pandas as pd
import os
from .schemas import PatientData

# Get absolute paths assuming the script runs from project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Load models at startup
try:
    scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.joblib"))
    model = joblib.load(os.path.join(MODELS_DIR, "logistic_regression.joblib"))
except Exception as e:
    print(f"Error loading models: {e}")
    scaler, model = None, None

def predict_risk(data: PatientData):
    # Map raw input to the exact 28 features used during training
    feature_dict = {
        'age': data.age,
        'resting_bp_systolic': data.resting_bp_systolic,
        'resting_bp_diastolic': data.resting_bp_diastolic,
        'cholesterol_total': data.cholesterol_total,
        'hdl': data.hdl,
        'ldl': data.ldl,
        'triglycerides': data.triglycerides,
        'fasting_blood_sugar': data.fasting_blood_sugar,
        'hba1c': data.hba1c,
        'bmi': data.bmi,
        'resting_heart_rate': data.resting_heart_rate,
        'max_heart_rate_achieved': data.max_heart_rate_achieved,
        'exercise_induced_angina': data.exercise_induced_angina,
        'st_depression': data.st_depression,
        'family_history': data.family_history,
        'alcohol_units_per_week': data.alcohol_units_per_week,
        'exercise_minutes_per_week': data.exercise_minutes_per_week,
        'sleep_hours': data.sleep_hours,
        'stress_score': data.stress_score,
        'wearable_owner': data.wearable_owner,
        'daily_steps': data.daily_steps,
        'diet_quality_score': data.diet_quality_score,
        
        # One-hot encoded features
        'sex_Male': 1 if data.sex == 'Male' else 0,
        'chest_pain_type_Atypical Angina': 1 if data.chest_pain_type == 'Atypical Angina' else 0,
        'chest_pain_type_Non-Anginal Pain': 1 if data.chest_pain_type == 'Non-Anginal Pain' else 0,
        'chest_pain_type_Typical Angina': 1 if data.chest_pain_type == 'Typical Angina' else 0,
        'smoker_status_Former': 1 if data.smoker_status == 'Former' else 0,
        'smoker_status_Never': 1 if data.smoker_status == 'Never' else 0
    }
    
    # Create DataFrame with exact column order
    df = pd.DataFrame([feature_dict])
    
    # Scale numerical features using pre-fitted scaler
    X_scaled = scaler.transform(df)
    
    # Predict
    prediction = int(model.predict(X_scaled)[0])
    probability = float(model.predict_proba(X_scaled)[0][1])
    
    risk_level = "High Risk" if prediction == 1 else "Low Risk"
    
    return {
        "prediction": prediction,
        "probability": probability,
        "risk_level": risk_level
    }
