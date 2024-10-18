from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/suggest_melody", methods=["POST"])
def suggest_melody():
    # TODO: Implement this
    json_ret = {
        "melody": "melody suggestion"
    }
    return json_ret

@app.route("/suggest_harmony", methods=["POST"])
def suggest_harmony():
    # TODO: Implement this
    json_ret = {
        "harmony": "harmony suggestion"
    }
    return json_ret

if __name__ == "__main__":
    app.run()