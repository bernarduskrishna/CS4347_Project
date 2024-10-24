from flask import Flask, request
import model2

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/suggest_melody", methods=["POST"])
def suggest_melody():
    json_data = request.get_json()
    abc = json_data["abc"]

    # strip first few lines and last few lines if they are empty
    abc = abc.split("\n")
    abc = [line for line in abc if line.strip() != ""]
    abc = abc[1:-1]
    abc = "\n".join(abc)

    melody_suggestion = model2.suggest_melody(abc)
    melody_suggestions = model2.suggest_melodies(abc)

    return {
        "abc": melody_suggestions
    }

if __name__ == "__main__":
    app.run()