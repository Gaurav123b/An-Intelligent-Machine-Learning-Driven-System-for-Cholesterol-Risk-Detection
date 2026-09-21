import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

df = pd.read_csv('data/raw/heart_disease_risk_2026.csv')

if 'patient_id' in df.columns:
    df.drop(columns=['patient_id'], inplace=True)
    
df = df.dropna()
categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
if categorical_cols:
    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)
    
X = df.drop(columns=['has_heart_disease'])
y = df['has_heart_disease']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

rf = RandomForestClassifier(n_estimators=500, max_depth=15, min_samples_split=2, min_samples_leaf=1, random_state=42)
rf.fit(X_train, y_train)
print('RF Accuracy:', accuracy_score(y_test, rf.predict(X_test)))

xgb = XGBClassifier(eval_metric='logloss', random_state=42, n_estimators=300, max_depth=6, learning_rate=0.05, subsample=0.8, colsample_bytree=0.8)
xgb.fit(X_train, y_train)
print('XGB Accuracy:', accuracy_score(y_test, xgb.predict(X_test)))
