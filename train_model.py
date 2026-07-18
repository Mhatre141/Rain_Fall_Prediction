import os

os.environ.setdefault("LOKY_MAX_CPU_COUNT", "1")
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")

import joblib
import pandas as pd
from sklearn.ensemble import HistGradientBoostingClassifier, HistGradientBoostingRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, mean_absolute_error, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline

DATA_PATH = "weatherAUS.csv"
MODEL_PATH = "rain_model_bundle.pkl"
FEATURES = ["AvgTemp", "AvgHumidity", "AvgWindSpeed"]


def build_dataset():
    df = pd.read_csv(DATA_PATH, usecols=[
        "MinTemp",
        "MaxTemp",
        "Humidity9am",
        "Humidity3pm",
        "WindSpeed9am",
        "WindSpeed3pm",
        "RainTomorrow",
        "Rainfall",
    ])

    df["AvgTemp"] = df[["MinTemp", "MaxTemp"]].mean(axis=1)
    df["AvgHumidity"] = df[["Humidity9am", "Humidity3pm"]].mean(axis=1)
    df["AvgWindSpeed"] = df[["WindSpeed9am", "WindSpeed3pm"]].mean(axis=1)
    df = df.dropna(subset=["RainTomorrow"])
    df["RainTomorrow"] = df["RainTomorrow"].map({"No": 0, "Yes": 1}).astype(int)
    df["Rainfall"] = df["Rainfall"].fillna(0).clip(lower=0)
    return df[FEATURES], df["RainTomorrow"], df["Rainfall"]


def main():
    X, y_rain, y_amount = build_dataset()

    X_train, X_test, y_train, y_test, amount_train, amount_test = train_test_split(
        X,
        y_rain,
        y_amount,
        test_size=0.2,
        random_state=42,
        stratify=y_rain,
    )

    classifier = make_pipeline(
        SimpleImputer(strategy="median"),
        HistGradientBoostingClassifier(
            learning_rate=0.08,
            max_iter=220,
            max_leaf_nodes=24,
            l2_regularization=0.02,
            random_state=42,
        ),
    )
    regressor = make_pipeline(
        SimpleImputer(strategy="median"),
        HistGradientBoostingRegressor(
            learning_rate=0.06,
            max_iter=180,
            max_leaf_nodes=20,
            l2_regularization=0.05,
            random_state=42,
        ),
    )

    classifier.fit(X_train, y_train)
    regressor.fit(X_train, amount_train)

    probabilities = classifier.predict_proba(X_test)[:, 1]
    predictions = (probabilities >= 0.5).astype(int)
    rainfall_predictions = regressor.predict(X_test).clip(min=0)

    metrics = {
        "accuracy": round(float(accuracy_score(y_test, predictions)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, probabilities)), 4),
        "rainfall_mae_mm": round(float(mean_absolute_error(amount_test, rainfall_predictions)), 4),
        "training_rows": int(len(X_train)),
        "test_rows": int(len(X_test)),
    }

    joblib.dump(
        {
            "classifier": classifier,
            "regressor": regressor,
            "features": ["temperature", "humidity", "wind_speed"],
            "source_columns": FEATURES,
            "metrics": metrics,
        },
        MODEL_PATH,
        compress=3,
    )

    print(f"Saved {MODEL_PATH}")
    print(metrics)


if __name__ == "__main__":
    main()
