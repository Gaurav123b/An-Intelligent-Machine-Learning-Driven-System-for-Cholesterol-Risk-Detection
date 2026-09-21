import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score

df = pd.read_csv('data/raw/heart_disease_risk_2026.csv')

if 'patient_id' in df.columns:
    df.drop(columns=['patient_id'], inplace=True)
    
df = df.dropna()

# Feature Engineering
df['ldl_hdl_ratio'] = df['ldl'] / (df['hdl'] + 1e-5)
df['total_hdl_ratio'] = df['cholesterol_total'] / (df['hdl'] + 1e-5)

categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
if categorical_cols:
    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)
    
X = df.drop(columns=['has_heart_disease'])
y = df['has_heart_disease']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

rf = RandomForestClassifier(n_estimators=500, random_state=42)
rf.fit(X_train, y_train)
print('RF Accuracy:', accuracy_score(y_test, rf.predict(X_test)))

xgb = XGBClassifier(eval_metric='logloss', random_state=42)
xgb.fit(X_train, y_train)
print('XGB Accuracy:', accuracy_score(y_test, xgb.predict(X_test)))

mlp = MLPClassifier(hidden_layer_sizes=(128, 64, 32), max_iter=1000, random_state=42)
mlp.fit(X_train_scaled, y_train)
print('MLP Accuracy:', accuracy_score(y_test, mlp.predict(X_test_scaled)))
