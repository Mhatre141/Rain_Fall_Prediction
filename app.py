import os
from functools import lru_cache

os.environ.setdefault("LOKY_MAX_CPU_COUNT", "1")
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")

import joblib
import pandas as pd
from flask import Flask, jsonify, render_template, request

APP_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(APP_DIR, "rain_model_bundle.pkl")
MODEL_COLUMNS = ["AvgTemp", "AvgHumidity", "AvgWindSpeed"]

app = Flask(__name__)


@lru_cache(maxsize=1)
def load_model_bundle():
    if not os.path.exists(MODEL_PATH):
        return None
    return joblib.load(MODEL_PATH)


def clamp(value, low, high):
    return max(low, min(high, value))


def fallback_predict(temperature, humidity, wind_speed):
    """Fast deterministic backup when the trained model artifact is absent."""
    humidity_score = clamp((humidity - 45) / 55, 0, 1)
    cool_air_score = clamp((28 - temperature) / 24, 0, 1)
    storm_wind_score = clamp((wind_speed - 8) / 38, 0, 1)
    dry_heat_penalty = clamp((temperature - 30) / 18, 0, 0.35) + clamp((42 - humidity) / 42, 0, 0.3)

    probability = clamp(
        (humidity_score * 0.58 + cool_air_score * 0.24 + storm_wind_score * 0.18) - dry_heat_penalty,
        0,
        1,
    )
    expected_rainfall = 0.0
    if probability >= 0.5:
        expected_rainfall = max(0.4, (humidity - 58) * 0.16 + wind_speed * 0.05 + (27 - temperature) * 0.08)

    return probability, expected_rainfall, "fallback-weather-score"


def predict_weather(temperature, humidity, wind_speed):
    bundle = load_model_bundle()

    if bundle:
        features = pd.DataFrame([[temperature, humidity, wind_speed]], columns=MODEL_COLUMNS)
        classifier = bundle["classifier"]
        regressor = bundle["regressor"]
        probability = float(classifier.predict_proba(features)[0][1])
        rainfall = float(max(0, regressor.predict(features)[0]))
        source = "trained-weather-model"
    else:
        probability, rainfall, source = fallback_predict(temperature, humidity, wind_speed)

    will_rain = probability >= 0.5
    if not will_rain:
        rainfall = 0.0

    if probability >= 0.78:
        condition = "Heavy rain likely"
    elif probability >= 0.5:
        condition = "Rain likely"
    elif probability >= 0.32:
        condition = "Cloudy chance"
    else:
        condition = "Clear outlook"

    return {
        "rain_prediction": "Yes" if will_rain else "No",
        "will_rain": will_rain,
        "expected_rainfall_mm": round(rainfall, 1),
        "confidence_score": round(probability * 100, 1),
        "condition": condition,
        "model_source": source,
    }


@app.get("/")
def home():
    return render_template("index.html")


@app.get("/health")
def health():
    return jsonify({"status": "healthy", "model_loaded": load_model_bundle() is not None})


@app.post("/predict_rain")
def predict_rain():
    data = request.get_json(silent=True) or request.form
    required = ("temperature", "humidity", "wind_speed")

    try:
        values = {key: float(data[key]) for key in required}
    except (KeyError, TypeError, ValueError):
        return jsonify({"error": "Please enter valid temperature, humidity, and wind speed values."}), 400

    if not -50 <= values["temperature"] <= 60:
        return jsonify({"error": "Temperature must be between -50 and 60 C."}), 400
    if not 0 <= values["humidity"] <= 100:
        return jsonify({"error": "Humidity must be between 0 and 100%."}), 400
    if not 0 <= values["wind_speed"] <= 160:
        return jsonify({"error": "Wind speed must be between 0 and 160 km/h."}), 400

    return jsonify(predict_weather(**values))


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
