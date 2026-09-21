import pandas as pd
import numpy as np
import os
import sys

INPUT_PATH = "data/processed/sampled_data.csv"
OUTPUT_PATH = "data/processed/cleaned_data.csv"

TARGET = "has_heart_disease"

def main():
    if not os.path.exists(INPUT_PATH):
        print(f"Error: {INPUT_PATH} not found.")
        sys.exit(1)
        
    print(f"Loading data from {INPUT_PATH}...")
    df = pd.read_csv(INPUT_PATH)
    initial_rows = len(df)
    
    if TARGET not in df.columns:
        print(f"Error: Target column '{TARGET}' not found.")
        sys.exit(1)
        
    print("\n--- Cleaning Process ---")
    
    # 1. Drop duplicates
    duplicates = df.duplicated().sum()
    print(f"\nDuplicate rows found: {duplicates}")
    df_before_dup = len(df)
    df.drop_duplicates(inplace=True)
    rows_dropped_dup = df_before_dup - len(df)
    if rows_dropped_dup > 0:
        print(f"-> Removed {rows_dropped_dup} duplicate rows.")
    
    # 2. Impute missing values
    missing_before = df.isnull().sum().sum()
    print(f"\nMissing values before imputation: {missing_before}")
    if missing_before > 0:
        # Numeric columns get median
        numeric_cols = df.select_dtypes(include=[np.number]).columns.drop(TARGET, errors='ignore')
        for col in numeric_cols:
            df[col] = df[col].fillna(df[col].median())
        
        # Categorical columns get mode
        categorical_cols = df.select_dtypes(exclude=[np.number]).columns
        for col in categorical_cols:
            df[col] = df[col].fillna(df[col].mode()[0])
            
        print("-> Missing values imputed (Median for numeric, Mode for categorical).")
    else:
        print("-> No missing values found.")
        
    # 3. Check invalid values for specific known lipids (if they exist in df)
    print("\nChecking for invalid numeric values in lipid profiles...")
    invalid_count = 0
    invalid_mask = pd.Series([False] * len(df), index=df.index)
    for lipid in ['ldl', 'hdl', 'triglycerides']:
        if lipid in df.columns:
            invalid_mask = invalid_mask | (df[lipid] <= 0)
            
    invalid_count = invalid_mask.sum()
    if invalid_count > 0:
        df = df[~invalid_mask]
        print(f"-> Removed {invalid_count} rows with biologically impossible lipid values (<= 0).")
    else:
        print("-> No invalid numeric values (<= 0) found in lipid columns.")
        
    # 4. Check whether target contains unexpected labels
    print("\nChecking target labels...")
    unexpected_labels_mask = ~df[TARGET].isin([0, 1])
    unexpected_count = unexpected_labels_mask.sum()
    if unexpected_count > 0:
        df = df[~unexpected_labels_mask]
        print(f"-> Removed {unexpected_count} rows with unexpected labels in target.")
        
    # 5. One-Hot Encoding for categoricals
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    if categorical_cols:
        print(f"\nOne-Hot Encoding categorical features: {categorical_cols}")
        df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)
        # Convert boolean columns to int
        for col in df.columns:
            if df[col].dtype == bool:
                df[col] = df[col].astype(int)
    
    final_rows = len(df)
    
    # Save the cleaned dataset
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False)
    
    # Generate cleaning report
    print("\n===========================================")
    print("          DATA CLEANING REPORT             ")
    print("===========================================")
    print(f"Rows before cleaning: {initial_rows}")
    print(f"Rows after cleaning:  {final_rows}")
    print(f"Total rows removed:   {initial_rows - final_rows}")
    
    features = [c for c in df.columns if c != TARGET]
    print(f"\n--- Final Features ({len(features)} total) ---")
    print(features)
    
    print("\n--- Final Target Distribution ---")
    print(df[TARGET].value_counts())
    
    print(f"\n✅ Cleaned dataset successfully saved to: {os.path.abspath(OUTPUT_PATH)}")

if __name__ == "__main__":
    main()
