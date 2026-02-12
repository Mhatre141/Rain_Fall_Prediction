import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
import joblib

# Load data
df = pd.read_csv("weatherAUS.csv")

# Preprocessing
df = df.drop(['Date', 'Location'], axis=1)
df["AvgTemp"] = (df['MinTemp'] + df["MaxTemp"]) / 2
df["AvgHumidity"] = (df["Humidity9am"] + df["Humidity3pm"]) / 2
df["AvgWindSpeed"] = (df["WindSpeed9am"] + df['WindSpeed3pm']) / 2
df = df[["AvgTemp", "AvgHumidity", "AvgWindSpeed", "RainTomorrow", "Rainfall"]]

# Impute
all_avg = SimpleImputer(strategy='mean')
df[["AvgTemp", "AvgHumidity", "AvgWindSpeed", 'Rainfall']] = all_avg.fit_transform(
    df[["AvgTemp", "AvgHumidity", "AvgWindSpeed", 'Rainfall']]
)

# Encode RainTomorrow
le = LabelEncoder()
df['RainTomorrow'] = le.fit_transform(df["RainTomorrow"])

# Split for classifier
X = df[["AvgTemp", "AvgHumidity", "AvgWindSpeed"]]
y = df['RainTomorrow']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train classifier
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Split for regressor
y_r = df['Rainfall']
X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(X, y_r, test_size=0.2, random_state=42)

# Train regressor
reg = RandomForestRegressor(n_estimators=100, random_state=42)
reg.fit(X_train_r, y_train_r)

# Save models
joblib.dump(clf, 'rain_classifier.pkl')
joblib.dump(reg, 'rain_regressor.pkl')
joblib.dump(le, 'label_encoder.pkl')

print("Models trained and saved.")