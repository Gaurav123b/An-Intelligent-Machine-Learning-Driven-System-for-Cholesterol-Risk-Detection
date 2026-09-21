import sys
import joblib
import pandas as pd
import os

MODELS_DIR = "models/"
SCALER_PATH = os.path.join(MODELS_DIR, "scaler.joblib")
MODEL_PATH = os.path.join(MODELS_DIR, "logistic_regression.joblib") # Best model

def predict_risk(ldl, hdl, triglycerides):
    # 1. User Input
    print("\n==================================")
    print("      CARDIOAI PREDICTION LOG     ")
    print("==================================")
    print("\n--- 1. User Input Received ---")
    print(f"LDL: {ldl}")
    print(f"HDL: {hdl}")
    print(f"Triglycerides: {triglycerides}")
    
    # 2. Data Validation
    print("\n--- 2. Data Validation ---")
    try:
        ldl = float(ldl)
        hdl = float(hdl)
        triglycerides = float(triglycerides)
    except ValueError:
        print("❌ Error: All lipid values must be numeric.")
        return
        
    if ldl <= 0 or hdl <= 0 or triglycerides <= 0:
        print("❌ Error: Lipid values must be greater than zero.")
        return
        
    print("✅ Data validated successfully (Values are numeric and > 0).")
    
    # 3. Same Preprocessing
    print("\n--- 3. Preprocessing ---")
    if not os.path.exists(SCALER_PATH) or not os.path.exists(MODEL_PATH):
        print("❌ Error: Model or Scaler not found in models/ directory.")
        return
        
    scaler = joblib.load(SCALER_PATH)
    model = joblib.load(MODEL_PATH)
    
    # Create DataFrame for scaler (must match training feature names exactly)
    input_data = pd.DataFrame([[ldl, hdl, triglycerides]], columns=["ldl", "hdl", "triglycerides"])
    scaled_data = scaler.transform(input_data)
    print("✅ Applied StandardScaler (fitted from original training data).")
    
    # 4. ML Model Inference
    print("\n--- 4. ML Model Inference ---")
    print(f"Running inference using Logistic Regression model...")
    prob = model.predict_proba(scaled_data)[0]
    prob_disease = prob[1] # Probability of class 1 (has_heart_disease)
    
    # 5. Probability Prediction
    print("\n--- 5. Probability Prediction ---")
    print(f"Calculated Probability of Heart Disease: {prob_disease * 100:.2f}%")
    
    # 6. Risk Classification
    print("\n--- 6. Risk Classification ---")
    threshold = 0.5
    if prob_disease >= threshold:
        classification = "ELEVATED RISK"
        print(f"Classification: 🚨 {classification}")
    else:
        classification = "LOWER RISK"
        print(f"Classification: 🟢 {classification}")
        
    print("\n*** DISCLAIMER ***")
    print("This is a purely mathematical prediction based on a limited dataset.")
    print("It is NOT a clinical diagnosis and should not replace medical advice.")
    print("==================================\n")

if __name__ == "__main__":
    # If arguments are passed via CLI, use them, otherwise use the default test case
    if len(sys.argv) == 4:
        predict_risk(sys.argv[1], sys.argv[2], sys.argv[3])
    else:
        predict_risk(160, 38, 240)
