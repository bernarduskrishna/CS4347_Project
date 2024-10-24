from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import model2

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Set a folder for uploads
DATA_FOLDER = './data/'
XML_FOLDER = DATA_FOLDER + 'xml/'
ABC_FOLDER = DATA_FOLDER + 'abc/'
os.makedirs(XML_FOLDER, exist_ok=True)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

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