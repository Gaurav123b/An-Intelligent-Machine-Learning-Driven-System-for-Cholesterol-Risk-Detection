import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier
from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import accuracy_score
from imblearn.over_sampling import SMOTE

df = pd.read_csv('data/raw/heart_disease_risk_2026.csv')
if 'patient_id' in df.columns: df.drop(columns=['patient_id'], inplace=True)
df = df.dropna()
categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
if categorical_cols: df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

X = df.drop(columns=['has_heart_disease'])
y = df['has_heart_disease']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

smote = SMOTE(random_state=42)
X_train_sm, y_train_sm = smote.fit_resample(X_train_scaled, y_train)

# Try XGBoost with scale_pos_weight
ratio = float(y_train.value_counts()[0]) / y_train.value_counts()[1]
xgb = XGBClassifier(eval_metric='logloss', scale_pos_weight=ratio, random_state=42)
xgb.fit(X_train_scaled, y_train)
print('XGB with scale_pos_weight Accuracy:', accuracy_score(y_test, xgb.predict(X_test_scaled)))

# Try HistGradientBoosting
hgb = HistGradientBoostingClassifier(random_state=42, max_iter=200)
hgb.fit(X_train_scaled, y_train)
print('HistGradientBoosting Accuracy:', accuracy_score(y_test, hgb.predict(X_test_scaled)))

# Try XGBoost on SMOTE data
xgb_smote = XGBClassifier(eval_metric='logloss', random_state=42)
xgb_smote.fit(X_train_sm, y_train_sm)
print('XGBoost SMOTE Accuracy:', accuracy_score(y_test, xgb_smote.predict(X_test_scaled)))

# Try Random Forest on SMOTE data
rf_smote = RandomForestClassifier(n_estimators=300, random_state=42)
rf_smote.fit(X_train_sm, y_train_sm)
print('Random Forest SMOTE Accuracy:', accuracy_score(y_test, rf_smote.predict(X_test_scaled)))
