"""
RainSense — Flask REST API
Handles HTTP routing and delegates all ML logic to model.py
"""

import os

# Limit CPU thread usage for compatibility on cloud hosts
os.environ.setdefault("LOKY_MAX_CPU_COUNT", "1")
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")

from flask import Flask, jsonify, request
from flask_cors import CORS

from model import load_model, predict
from utils import validate_inputs, ValidationError

app = Flask(__name__)

# Allow requests from any origin (tighten in production via CORS_ORIGINS env var)
CORS(app, origins=os.environ.get("CORS_ORIGINS", "*"))


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    return jsonify({"service": "RainSense API", "version": "1.0.0", "status": "running"})


@app.get("/health")
def health():
    model_ready = load_model() is not None
    return jsonify({
        "status": "healthy" if model_ready else "degraded",
        "model_loaded": model_ready,
    })


@app.post("/predict")
def predict_rain():
    """
    Accepts JSON: { "temperature": float, "humidity": float, "wind_speed": float }
    Returns:      { "rain": "YES"|"NO", "rainfall": "X.X mm", "confidence": float,
                    "condition": str, "will_rain": bool }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON."}), 400

    try:
        temperature, humidity, wind_speed = validate_inputs(data)
    except ValidationError as exc:
        return jsonify({"error": str(exc)}), 400

    result = predict(temperature, humidity, wind_speed)
    return jsonify(result)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
