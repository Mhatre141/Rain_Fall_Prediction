"""
RainSense — Input Validation Utilities
"""


class ValidationError(ValueError):
    """Raised when API inputs fail validation checks."""


FIELD_MAP = {
    "temperature": "temperature",
    "humidity":    "humidity",
    "wind_speed":  "wind_speed",
    # Accept camelCase from older clients
    "windspeed":   "wind_speed",
    "windSpeed":   "wind_speed",
}

BOUNDS = {
    "temperature": (-50.0, 60.0,  "Temperature must be between -50 °C and 60 °C."),
    "humidity":    (  0.0, 100.0, "Humidity must be between 0 % and 100 %."),
    "wind_speed":  (  0.0, 160.0, "Wind speed must be between 0 and 160 km/h."),
}


def _get_field(data: dict, canonical: str) -> float:
    """Extract a field from the request dict, accepting known aliases."""
    aliases = [k for k, v in FIELD_MAP.items() if v == canonical]
    for alias in aliases:
        if alias in data:
            try:
                return float(data[alias])
            except (TypeError, ValueError):
                raise ValidationError(
                    f"'{alias}' must be a valid number."
                )
    raise ValidationError(f"Missing required field: '{canonical}'.")


def validate_inputs(data: dict) -> tuple[float, float, float]:
    """
    Parse and validate temperature, humidity, and wind_speed from request data.

    Returns:
        (temperature, humidity, wind_speed) as floats

    Raises:
        ValidationError: on missing or out-of-range inputs
    """
    temperature = _get_field(data, "temperature")
    humidity    = _get_field(data, "humidity")
    wind_speed  = _get_field(data, "wind_speed")

    for name, value in [
        ("temperature", temperature),
        ("humidity",    humidity),
        ("wind_speed",  wind_speed),
    ]:
        lo, hi, msg = BOUNDS[name]
        if not lo <= value <= hi:
            raise ValidationError(msg)

    return temperature, humidity, wind_speed
