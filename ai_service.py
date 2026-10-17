from google import genai

from config import GEMINI_MODEL


def generate_ai_summary(api_key: str, prompt: str) -> str:
    """Return Gemini's answer. Raises on failure so the caller can report it."""
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(model=GEMINI_MODEL, contents=prompt)
    return (response.text or "").strip()
