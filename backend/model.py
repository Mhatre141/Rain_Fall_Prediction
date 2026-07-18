"""
RainSense — ML Model Layer
Handles model loading and prediction logic, completely separate from the API.
"""

import os
from functools import lru_cache

import joblib
import numpy as np
import pandas as pd

APP_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(APP_DIR, "rain_model_bundle.pkl")
MODEL_COLUMNS = ["AvgTemp", "AvgHumidity", "AvgWindSpeed"]


@lru_cache(maxsize=1)
def load_model():
    """Load and cache the trained model bundle from disk."""
    if not os.path.exists(MODEL_PATH):
        return None
    return joblib.load(MODEL_PATH)


def _fallback_predict(temperature: float, humidity: float, wind_speed: float):
    """
    Deterministic heuristic used when the trained model is unavailable.
    Mirrors the feature-weight intuition of the trained classifier.
    """
    def clamp(v, lo, hi):
        return max(lo, min(hi, v))

    humidity_score   = clamp((humidity - 45) / 55, 0, 1)
    cool_air_score   = clamp((28 - temperature) / 24, 0, 1)
    storm_wind_score = clamp((wind_speed - 8) / 38, 0, 1)
    dry_penalty = (
        clamp((temperature - 30) / 18, 0, 0.35)
        + clamp((42 - humidity) / 42, 0, 0.30)
    )

    probability = clamp(
        humidity_score * 0.58 + cool_air_score * 0.24 + storm_wind_score * 0.18 - dry_penalty,
        0, 1,
    )

    rainfall = 0.0
    if probability >= 0.5:
        rainfall = max(0.4, (humidity - 58) * 0.16 + wind_speed * 0.05 + (27 - temperature) * 0.08)

    return probability, rainfall


def _condition_label(probability: float) -> str:
    if probability >= 0.78:
        return "Heavy rain likely"
    if probability >= 0.50:
        return "Rain likely"
    if probability >= 0.32:
        return "Cloudy with a chance"
    return "Clear outlook"


def predict(temperature: float, humidity: float, wind_speed: float) -> dict:
    """
    Run the rainfall prediction pipeline.

    Returns:
        {
            "rain": "YES" | "NO",
            "will_rain": bool,
            "rainfall": "X.X mm",
            "expected_rainfall_mm": float,
            "confidence": float,   # 0–100
            "condition": str,
            "model_source": str,
        }
    """
    bundle = load_model()

    if bundle:
        features = pd.DataFrame(
            [[temperature, humidity, wind_speed]], columns=MODEL_COLUMNS
        )
        probability = float(bundle["classifier"].predict_proba(features)[0][1])
        rainfall_mm = float(max(0.0, bundle["regressor"].predict(features)[0]))
        source = "trained-ml-model"
    else:
        probability, rainfall_mm = _fallback_predict(temperature, humidity, wind_speed)
        source = "heuristic-fallback"

    will_rain = probability >= 0.5
    if not will_rain:
        rainfall_mm = 0.0

    return {
        "rain": "YES" if will_rain else "NO",
        "will_rain": will_rain,
        "rainfall": f"{rainfall_mm:.1f} mm",
        "expected_rainfall_mm": round(rainfall_mm, 1),
        "confidence": round(probability * 100, 1),
        "condition": _condition_label(probability),
        "model_source": source,
    }
