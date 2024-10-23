from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# import model

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Set a folder for uploads
DATA_FOLDER = './data/'
XML_FOLDER = DATA_FOLDER + 'xml/'
ABC_FOLDER = DATA_FOLDER + 'abc/'
os.makedirs(XML_FOLDER, exist_ok=True)

@app.route("/upload_xml", methods=["POST"])
def upload_xml():
    if 'musicxml' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['musicxml']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and file.filename.endswith('.musicxml'):
        file_path = os.path.join(XML_FOLDER, file.filename)
        file.save(file_path)  # Save the file
        os.system('python xml2abc.py ' + file_path +  ' -o ' + ABC_FOLDER) # Run abc conversion command
        print('Reading from ' + ABC_FOLDER + file.filename[:-8] + 'abc ...')
        f = open(ABC_FOLDER + file.filename[:-8] + 'abc', "r")
        abc_result = f.read()
        print(abc_result)
        return jsonify({'result': abc_result, 'filename': file.filename}), 200

    return jsonify({'error': 'Invalid file type'}), 400

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