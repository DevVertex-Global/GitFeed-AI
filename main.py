from flask import Flask, jsonify, render_template, request

from ai_service import generate_ai_summary
from config import PORT

app = Flask(__name__)

LANGUAGES = {
    "en": "English", "bn": "Bengali", "es": "Spanish", "fr": "French",
    "de": "German", "zh": "Chinese", "ja": "Japanese", "ru": "Russian",
    "ar": "Arabic", "hi": "Hindi", "pt": "Portuguese", "ko": "Korean",
}


# --- Pages ---
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/trending")
def trending():
    return render_template("trending.html")


@app.route("/starred")
def starred():
    return render_template("starred.html")


@app.route("/profile")
def profile():
    return render_template("profile.html")


@app.route("/settings")
def settings():
    return render_template("settings.html")


@app.route("/privacy")
def privacy():
    return render_template("privacy.html")


# --- API ---
def _clip(value, limit):
    return str(value or "")[:limit]


@app.route("/api/ai-summary", methods=["POST"])
def api_ai_summary():
    """Analyse a repo with Gemini. The key is supplied per request and never stored."""
    data = request.get_json(silent=True) or {}
    api_key = _clip(data.get("api_key"), 200).strip()
    if not api_key:
        return jsonify({"status": "error", "message": "Gemini API key is missing."}), 400

    repo = _clip(data.get("repo"), 200)
    if not repo:
        return jsonify({"status": "error", "message": "Repository name is missing."}), 400

    language = LANGUAGES.get(data.get("lang"), "English")
    prompt = (
        f"You are helping a developer evaluate a GitHub repository.\n"
        f"Repository: {repo}\n"
        f"Description: {_clip(data.get('description'), 500) or 'N/A'}\n"
        f"Main language: {_clip(data.get('language'), 50) or 'N/A'}\n"
        f"Stars: {_clip(data.get('stars'), 20) or 'N/A'}\n\n"
        f"In 4-5 short lines explain what it is likely used for, who should use it, "
        f"and one thing to check before adopting it. Reply in {language}."
    )
    try:
        summary = generate_ai_summary(api_key, prompt)
    except Exception as exc:  # network / invalid key / quota
        return jsonify({"status": "error", "message": f"AI request failed: {str(exc)[:200]}"}), 502
    return jsonify({"status": "success", "summary": summary})


@app.errorhandler(404)
def not_found(_):
    return render_template("base.html"), 404


if __name__ == "__main__":
    print(f"🚀 GitFeed-AI Server Running on http://127.0.0.1:{PORT} ...")
    app.run(host="0.0.0.0", port=PORT, debug=False)
