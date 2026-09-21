import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score
import json

df = pd.read_csv('data/raw/heart_disease_risk_2026.csv')
if 'patient_id' in df.columns: df.drop(columns=['patient_id'], inplace=True)
df = df.dropna()

categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
for col in categorical_cols:
    df[col] = LabelEncoder().fit_transform(df[col].astype(str))

X = df.drop(columns=['has_heart_disease'])
y = df['has_heart_disease']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

params = {
    'n_estimators': [100, 300, 500],
    'max_depth': [3, 5, 7],
    'learning_rate': [0.01, 0.05, 0.1],
    'subsample': [0.8, 1.0],
    'colsample_bytree': [0.8, 1.0]
}

xgb = XGBClassifier(eval_metric='logloss', random_state=42)
gs = GridSearchCV(xgb, params, cv=3, scoring='accuracy', n_jobs=-1)
gs.fit(X_train, y_train)

best = gs.best_estimator_
acc = accuracy_score(y_test, best.predict(X_test))
print("Best params:", gs.best_params_)
print("Best Accuracy:", acc)

# Write to file
with open('scratch_best_params.json', 'w') as f:
    json.dump({'params': gs.best_params_, 'acc': acc}, f)
