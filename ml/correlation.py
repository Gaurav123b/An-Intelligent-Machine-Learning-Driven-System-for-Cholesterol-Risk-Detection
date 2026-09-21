import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os
import sys

INPUT_PATH = "data/processed/cleaned_data.csv"
CORR_OUTPUT_PATH = "data/processed/correlation_matrix.csv"
OUTPUT_DIR = "ml/outputs/"

FEATURES = ["ldl", "hdl", "triglycerides"]
TARGET = "has_heart_disease"
ALL_COLS = FEATURES + [TARGET]

def get_correlation_report(corr_matrix):
    # Flatten the matrix and get pairs
    # Extract only upper triangle to avoid duplicates and self-correlations
    c = corr_matrix.copy()
    for i in range(len(c.columns)):
        for j in range(i+1):
            c.iloc[i, j] = pd.NA
            
    c_unstacked = c.unstack().dropna()
    
    if c_unstacked.empty:
        return "No correlations found.", "", "", ""

    strongest_pos = c_unstacked.idxmax()
    strongest_pos_val = c_unstacked.max()
    
    strongest_neg = c_unstacked.idxmin()
    strongest_neg_val = c_unstacked.min()
    
    # Weakest correlation (closest to 0)
    weakest = c_unstacked.abs().idxmin()
    weakest_val = c_unstacked[weakest]
    
    report = f"""
--- Correlation Analysis Report ---
Strongest Positive Correlation: {strongest_pos[0]} and {strongest_pos[1]} ({strongest_pos_val:.4f})
Strongest Negative Correlation: {strongest_neg[0]} and {strongest_neg[1]} ({strongest_neg_val:.4f})
Weakest Correlation: {weakest[0]} and {weakest[1]} ({weakest_val:.4f})

LIMITATIONS OF CORRELATION ANALYSIS:
1. Correlation does not imply causation. A strong correlation between a lipid and heart disease risk does not mean the lipid directly causes the disease.
2. Pearson correlation only captures linear relationships. Non-linear patterns might exist but won't be reflected in the correlation coefficient.
3. We are only analyzing three features; other confounding variables (like age, smoking, BMI) are omitted but might be the true underlying drivers.
4. The target variable is categorical (0 or 1), making Pearson correlation equivalent to point-biserial correlation, which has limitations compared to continuous-continuous correlation.
"""
    return report

def main():
    if not os.path.exists(INPUT_PATH):
        print(f"Error: {INPUT_PATH} not found.")
        sys.exit(1)
        
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(CORR_OUTPUT_PATH), exist_ok=True)
    
    print(f"Loading data from {INPUT_PATH}...")
    df = pd.read_csv(INPUT_PATH)
    
    # Subset to the columns we care about
    df = df[ALL_COLS]
    
    # 1. Pearson correlation matrix
    corr_matrix = df.corr(method='pearson')
    
    # 7. Print the correlation matrix
    print("\n--- Pearson Correlation Matrix ---")
    print(corr_matrix.round(4))
    
    # 8. Save the correlation matrix
    corr_matrix.to_csv(CORR_OUTPUT_PATH)
    print(f"\n✅ Correlation matrix saved to: {CORR_OUTPUT_PATH}")
    
    # 2. Correlation heatmap
    plt.figure(figsize=(8, 6))
    sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt=".3f", vmin=-1, vmax=1)
    plt.title('Pearson Correlation Heatmap')
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "correlation_heatmap.png"))
    plt.close()
    
    # 3. LDL vs HDL scatter plot
    plt.figure(figsize=(8, 6))
    sns.scatterplot(x='ldl', y='hdl', hue=TARGET, data=df, alpha=0.6)
    plt.title('LDL vs HDL')
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "scatter_ldl_vs_hdl.png"))
    plt.close()
    
    # 4. LDL vs Triglycerides scatter plot
    plt.figure(figsize=(8, 6))
    sns.scatterplot(x='ldl', y='triglycerides', hue=TARGET, data=df, alpha=0.6)
    plt.title('LDL vs Triglycerides')
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "scatter_ldl_vs_triglycerides.png"))
    plt.close()
    
    # 5. HDL vs Triglycerides scatter plot
    plt.figure(figsize=(8, 6))
    sns.scatterplot(x='hdl', y='triglycerides', hue=TARGET, data=df, alpha=0.6)
    plt.title('HDL vs Triglycerides')
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "scatter_hdl_vs_triglycerides.png"))
    plt.close()
    
    # 6. Each lipid variable vs has_heart_disease
    # Boxplots are appropriate for Continuous vs Categorical (Binary)
    plt.figure(figsize=(15, 5))
    for i, feature in enumerate(FEATURES, 1):
        plt.subplot(1, 3, i)
        sns.boxplot(x=TARGET, y=feature, data=df)
        plt.title(f'{feature} vs Heart Disease')
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "boxplots_lipids_vs_target.png"))
    plt.close()
    
    print(f"✅ Visualizations saved to: {OUTPUT_DIR}")
    
    # Create and print the text report
    report = get_correlation_report(corr_matrix)
    print(report)
    
if __name__ == "__main__":
    main()
