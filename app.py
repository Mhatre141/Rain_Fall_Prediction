from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# ✅ CORS (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class PredictionRequest(BaseModel):
    temperature: float
    humidity: float
    wind_speed: float

@app.get("/")
def home():
    return {"message": "Rain Prediction API Running"}

@app.post("/predict_rain")
def predict_rain(data: PredictionRequest):
    # Simple logic (no ML error)
    if data.humidity > 60 and data.temperature < 25:
        rain = "Yes"
        rainfall = 12.5
    else:
        rain = "No"
        rainfall = 0.0

    return {
        "rain_prediction": rain,
        "expected_rainfall_mm": rainfall
    }


import os
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")  # ✅ CORRECT

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)


