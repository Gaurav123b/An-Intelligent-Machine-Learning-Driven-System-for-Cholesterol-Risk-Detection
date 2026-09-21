import pandas as pd
from sklearn.model_selection import train_test_split
import os
import sys

# Define configuration variables
RAW_DATA_PATH = "data/raw/heart_disease_risk_2026.csv"
PROCESSED_DATA_PATH = "data/processed/sampled_data.csv"
SAMPLE_SIZE = 10000 # Use full dataset to maximize accuracy
RANDOM_STATE = 42
TARGET_COLUMN = "has_heart_disease"

# Target column
TARGET_COLUMN = "has_heart_disease"

def main():
    # 1. Load the dataset
    if not os.path.exists(RAW_DATA_PATH):
        print(f"Error: {RAW_DATA_PATH} not found.")
        sys.exit(1)
        
    print(f"Loading data from {RAW_DATA_PATH}...")
    df = pd.read_csv(RAW_DATA_PATH)
    
    # 2. Drop patient_id as it has no predictive power
    if 'patient_id' in df.columns:
        df = df.drop(columns=['patient_id'])
    
    # 3. Display total rows, total columns, and class distribution
    original_size = len(df)
    original_cols = len(df.columns)
    
    # Calculate absolute counts and normalized percentages for the class distribution
    original_counts = df[TARGET_COLUMN].value_counts()
    original_percentages = df[TARGET_COLUMN].value_counts(normalize=True) * 100
    
    print("\n--- Original Dataset Statistics ---")
    print(f"Total rows: {original_size}")
    print(f"Total columns: {original_cols}")
    print(f"\nClass distribution ({TARGET_COLUMN}):\n{original_counts}")
    print(f"\nClass distribution (%):\n{original_percentages}")
    
    # Check if the requested sample size is larger than the dataset
    if SAMPLE_SIZE >= original_size:
        print(f"\nWarning: SAMPLE_SIZE ({SAMPLE_SIZE}) is >= original dataset size ({original_size}). No sampling needed.")
        sampled_df = df.copy()
    else:
        print(f"\n--- Performing Stratified Sampling ---")
        print(f"Target sample size: {SAMPLE_SIZE}")
        
        # 4. Perform stratified random sampling preserving the target-class distribution
        # We use train_test_split to easily get a stratified subset, holding out the rest
        # Setting random_state=42 ensures reproducibility
        sampled_df, _ = train_test_split(
            df,
            train_size=SAMPLE_SIZE,
            random_state=RANDOM_STATE,
            stratify=df[TARGET_COLUMN]
        )
    
    # Calculate statistics for the newly sampled dataset
    sampled_size = len(sampled_df)
    sampled_counts = sampled_df[TARGET_COLUMN].value_counts()
    sampled_percentages = sampled_df[TARGET_COLUMN].value_counts(normalize=True) * 100
    
    print("\n--- Sampled Dataset Statistics ---")
    print(f"Total rows: {sampled_size}")
    print(f"\nClass distribution ({TARGET_COLUMN}):\n{sampled_counts}")
    print(f"\nClass distribution (%):\n{sampled_percentages}")
    
    # 7. Save the sampled dataset
    os.makedirs(os.path.dirname(PROCESSED_DATA_PATH), exist_ok=True)
    sampled_df.to_csv(PROCESSED_DATA_PATH, index=False)
    
    # 8. Report exactly where the sampled CSV was saved
    print(f"\n✅ Sampled dataset successfully saved to: {os.path.abspath(PROCESSED_DATA_PATH)}")

if __name__ == "__main__":
    main()
