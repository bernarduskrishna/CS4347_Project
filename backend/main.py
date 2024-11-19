from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import model
import datetime

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Set a folder for uploads
DATA_FOLDER = 'data/'
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

    if file and (file.filename.endswith('.musicxml')) or file.filename.endswith('.xml'):
        file_path = os.path.join(XML_FOLDER, file.filename)
        file.save(file_path)  # Save the file
        ext_idx = -8 if file.filename.endswith('.musicxml') else -3
        os.system('python xml2abc.py ' + file_path +  ' -o ' + ABC_FOLDER) # Run abc conversion command
        print('Reading from ' + ABC_FOLDER + file.filename[:ext_idx] + 'abc ...')
        f = open(ABC_FOLDER + file.filename[:ext_idx] + 'abc', "r")
        abc_result = f.read()
        return jsonify({'result': abc_result, 'filename': file.filename}), 200

    return jsonify({'error': 'Invalid file type'}), 400

@app.route("/download_xml", methods=["POST"])
def download_xml():
    json_data = request.get_json()
    abc = json_data["abc"]

    timestamp = str(datetime.datetime.now()).replace(":", "-").replace(" ", "-")
    abc_file_path = os.path.join(ABC_FOLDER, f"{timestamp}.abc")
    with open(abc_file_path, 'w+') as file:
        for line in abc:
            file.write(line)
            file.write('\n')
    file.close()

    # Run abc2xml conversion (ensure abc2xml.py works correctly in the environment)
    os.system(f'python abc2xml.py {abc_file_path} -o {XML_FOLDER}')

    xml_file_path = os.path.join(XML_FOLDER, f"{timestamp}.xml")
    print(f'Reading from {xml_file_path}...')

    # Return the XML file as an attachment
    return send_file(xml_file_path, as_attachment=True, attachment_filename=f"{timestamp}.xml", mimetype='application/xml'), 200

@app.route("/suggest_melody", methods=["POST"])
def suggest_melody():
    json_data = request.get_json()
    abc = json_data["abc"]
    n_suggestions = json_data["n_suggestions"]
    temperature = json_data["temperature"]

    melody_suggestions = model.suggest_melodies(abc, n_suggestions, temperature)

    return {
        "abc": melody_suggestions
    }

@app.route("/suggest_harmony", methods=["POST"])
def suggest_harmony():
    json_data = request.get_json()
    chords = json_data["chords"]
    n_suggestions = json_data["n_suggestions"]
    temperature = json_data["temperature"]

    harmony_suggestions = model.suggest_harmonies(chords, n_suggestions, temperature)

    return {
        "chords": harmony_suggestions
    }

if __name__ == "__main__":
    app.run()