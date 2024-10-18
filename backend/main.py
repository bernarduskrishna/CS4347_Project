from flask import Flask, request
import model

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/suggest_melody", methods=["POST"])
def suggest_melody():
    json_data = request.get_json()
    melody = json_data["melody"]
    harmony = json_data["harmony"]

    # melody_suggestion = model.suggest_melody(melody, harmony)
    # For now, just return a hardcoded melody suggestion
    melody_suggestion = "D3 EFFED"

    return {
        "melody": melody_suggestion
    }

@app.route("/suggest_harmony", methods=["POST"])
def suggest_harmony():
    json_data = request.get_json()
    melody = json_data["melody"]
    harmony = json_data["harmony"]

    # harmony_suggestion = model.suggest_harmony(melody, harmony)
    # For now, just return a hardcoded harmony suggestion
    harmony_suggestion = "[G,B,D]8"

    return {
        "harmony": harmony_suggestion
    }

if __name__ == "__main__":
    app.run()