from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import uvicorn

# Create the FastAPI app
app = FastAPI(title="Rain Prediction API")

# Enable CORS - This allows frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the data model
class WeatherData(BaseModel):
    temperature: float
    humidity: float
    wind_speed: float

# Home endpoint
@app.get("/")
def home():
    return {"message": "Rain Prediction API is running!"}

# Prediction endpoint
@app.post("/predict_rain")
def predict_rain(data: WeatherData):
    """
    Predict rain based on weather parameters
    """
    try:
        # Simple prediction logic
        temp_score = max(0, (20 - data.temperature) / 10)
        humidity_score = max(0, (data.humidity - 60) / 40)
        wind_score = min(1, data.wind_speed / 50)
        
        # Combined score
        rain_score = (temp_score * 0.4 + humidity_score * 0.4 + wind_score * 0.2)
        
        # Add some randomness for realism
        rain_score += random.uniform(-0.2, 0.2)
        rain_score = max(0, min(1, rain_score))
        
        # Determine prediction
        rain_prediction = "Yes" if rain_score > 0.5 else "No"
        
        # Calculate rainfall amount if rain is predicted
        if rain_prediction == "Yes":
            base_rainfall = data.humidity * 0.1 + (30 - data.temperature) * 0.5
            expected_rainfall = max(0.1, base_rainfall + random.uniform(-2, 5))
        else:
            expected_rainfall = 0.0
        
        return {
            "rain_prediction": rain_prediction,
            "expected_rainfall_mm": round(expected_rainfall, 1),
            "confidence_score": round(rain_score * 100, 1)
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "rain_prediction": "Error",
            "expected_rainfall_mm": 0.0
        }

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "rain-prediction-api"}

# Run the server
if __name__ == "__main__":
    print("=" * 60)
    print("🌧️  RAIN PREDICTION API")
    print("=" * 60)
    print("Server starting on: http://127.0.0.1:8000")
    print("Test in browser: http://127.0.0.1:8000")
    print("API endpoint: POST http://127.0.0.1:8000/predict_rain")
    print("=" * 60)
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        log_level="info"
    )