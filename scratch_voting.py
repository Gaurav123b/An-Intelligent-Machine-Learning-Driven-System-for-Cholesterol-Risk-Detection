import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder, StandardScaler

df = pd.read_csv('data/raw/heart_disease_risk_2026.csv')
if 'patient_id' in df.columns: df.drop(columns=['patient_id'], inplace=True)
df = df.dropna()
categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
for col in categorical_cols:
    df[col] = LabelEncoder().fit_transform(df[col].astype(str))

X = df.drop(columns=['has_heart_disease'])
y = df['has_heart_disease']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42, stratify=y)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

lr = LogisticRegression(max_iter=1000, class_weight='balanced')
rf = RandomForestClassifier(n_estimators=500, random_state=42)
xgb = XGBClassifier(eval_metric='logloss', random_state=42)

voting = VotingClassifier(estimators=[('lr', lr), ('rf', rf), ('xgb', xgb)], voting='soft')
voting.fit(X_train_scaled, y_train)
print('Voting Accuracy:', accuracy_score(y_test, voting.predict(X_test_scaled)))
