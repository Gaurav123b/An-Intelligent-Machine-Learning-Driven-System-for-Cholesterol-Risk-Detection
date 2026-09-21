import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.metrics import (accuracy_score, precision_score, recall_score, 
                             f1_score, roc_auc_score, confusion_matrix, roc_curve)
import joblib
import os
import sys

INPUT_PATH = "data/processed/cleaned_data.csv"
MODELS_DIR = "models/"
OUTPUT_DIR = "ml/outputs/"
COMPARISON_PATH = os.path.join(OUTPUT_DIR, "model_comparison.csv")

# FEATURES will be dynamically inferred
TARGET = "has_heart_disease"

def plot_confusion_matrix(y_true, y_pred, model_name, ax):
    cm = confusion_matrix(y_true, y_pred)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', cbar=False, ax=ax)
    ax.set_title(f'{model_name}\nConfusion Matrix')
    ax.set_xlabel('Predicted Label')
    ax.set_ylabel('True Label')

def plot_feature_importance(model, model_name, features, ax):
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        indices = np.argsort(importances)[-10:] # Top 10 features
        
        ax.barh(range(len(indices)), importances[indices], align='center')
        ax.set_yticks(range(len(indices)))
        ax.set_yticklabels([features[i] for i in indices])
        ax.set_title(f'{model_name} Top 10 Features')
    else:
        ax.text(0.5, 0.5, 'No feature importances', ha='center', va='center')

def main():
    if not os.path.exists(INPUT_PATH):
        print(f"Error: {INPUT_PATH} not found.")
        sys.exit(1)
        
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print(f"Loading cleaned dataset from {INPUT_PATH}...")
    df = pd.read_csv(INPUT_PATH)
    
    FEATURES = [c for c in df.columns if c != TARGET]
    X = df[FEATURES]
    y = df[TARGET]
    
    # Re-create the EXACT SAME test set used during training by using the same random_state
    _, X_test, _, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Load Models and Scaler
    print("Loading models and scaler...")
    scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.joblib"))
    
    models = {
        "Logistic Regression": joblib.load(os.path.join(MODELS_DIR, "logistic_regression.joblib")),
        "Random Forest": joblib.load(os.path.join(MODELS_DIR, "random_forest.joblib")),
    }
    
    xgb_path = os.path.join(MODELS_DIR, "xgboost.joblib")
    if os.path.exists(xgb_path):
        models["XGBoost"] = joblib.load(xgb_path)
        
    X_test_scaled = scaler.transform(X_test)
    
    results = []
    
    # Setup plotting environments
    fig_cm, axes_cm = plt.subplots(1, len(models), figsize=(5 * len(models), 4))
    if len(models) == 1:
        axes_cm = [axes_cm]
        
    plt.figure(figsize=(8, 6))
    ax_roc = plt.gca()
    
    fig_fi, axes_fi = plt.subplots(1, 2, figsize=(10, 4))
    fi_idx = 0
    
    for idx, (name, model) in enumerate(models.items()):
        print(f"\nEvaluating {name}...")
        
        # Logistic regression was trained on scaled data, trees on unscaled data
        X_eval = X_test_scaled if name == "Logistic Regression" else X_test
        
        y_pred = model.predict(X_eval)
        # For ROC AUC, we need probabilities of the positive class
        y_prob = model.predict_proba(X_eval)[:, 1] if hasattr(model, 'predict_proba') else y_pred
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred)
        rec = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        roc_auc = roc_auc_score(y_test, y_prob)
        
        results.append({
            "Model": name,
            "Accuracy": acc,
            "Precision": prec,
            "Recall": rec,
            "F1-score": f1,
            "ROC-AUC": roc_auc
        })
        
        # Confusion Matrix
        plot_confusion_matrix(y_test, y_pred, name, axes_cm[idx])
        
        # ROC Curve
        fpr, tpr, _ = roc_curve(y_test, y_prob)
        ax_roc.plot(fpr, tpr, label=f"{name} (AUC = {roc_auc:.3f})")
        
        # Feature Importance
        if name in ["Random Forest", "XGBoost"]:
            if fi_idx < 2:
                plot_feature_importance(model, name, FEATURES, axes_fi[fi_idx])
                fi_idx += 1
                
    # Save Confusion Matrices
    fig_cm.tight_layout()
    fig_cm.savefig(os.path.join(OUTPUT_DIR, "confusion_matrices.png"))
    plt.close(fig_cm)
    
    # Save ROC Curve
    ax_roc.plot([0, 1], [0, 1], 'k--')
    ax_roc.set_xlabel('False Positive Rate')
    ax_roc.set_ylabel('True Positive Rate')
    ax_roc.set_title('ROC Curves')
    ax_roc.legend(loc='lower right')
    ax_roc.figure.tight_layout()
    ax_roc.figure.savefig(os.path.join(OUTPUT_DIR, "roc_curves.png"))
    plt.close(ax_roc.figure)
    
    # Save Feature Importances
    fig_fi.tight_layout()
    fig_fi.savefig(os.path.join(OUTPUT_DIR, "feature_importances.png"))
    plt.close(fig_fi)
    
    # Results Table
    results_df = pd.DataFrame(results).round(4)
    results_df.to_csv(COMPARISON_PATH, index=False)
    
    print("\n===========================================")
    print("          MODEL EVALUATION REPORT          ")
    print("===========================================")
    print(results_df.to_string(index=False))
    
    print(f"\n✅ Comparison table saved to: {COMPARISON_PATH}")
    print(f"✅ Visualizations saved to: {OUTPUT_DIR}")
    
    # Determine the best model based on ROC-AUC
    # We do NOT use accuracy as the sole decider because of class imbalance.
    best_model_row = results_df.loc[results_df['ROC-AUC'].idxmax()]
    best_model_name = best_model_row['Model']
    best_roc_auc = best_model_row['ROC-AUC']
    
    print("\n--- Evaluation Conclusion ---")
    print(f"Best Model (based on ROC-AUC): {best_model_name} with ROC-AUC of {best_roc_auc}")
    print("Note: We selected ROC-AUC as the primary criterion instead of Accuracy because it effectively measures the model's ability to distinguish between classes across all decision thresholds.")
    print("\n*** DISCLAIMER ***")
    print("These results represent mathematical performance on a specific dataset using limited features.")
    print("They do NOT imply or claim clinical effectiveness and must not be used for actual medical diagnosis.")

if __name__ == "__main__":
    main()
