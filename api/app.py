from flask import Flask, send_from_directory, request, jsonify
import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_FOLDER = os.path.join(BASE_DIR, '../templates')
STATIC_FOLDER = os.path.join(BASE_DIR, '../public')

app = Flask(__name__, static_folder=STATIC_FOLDER, template_folder=TEMPLATE_FOLDER)

@app.route('/')
def home():
    return send_from_directory(TEMPLATE_FOLDER, 'index.html')

@app.route('/leaderboard')
def leaderboard():
    data_path = os.path.join(TEMPLATE_FOLDER, 'data.json')
    try:
        with open(data_path) as f:
            data = json.load(f)
            return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "data.json not found"}), 404

@app.route('/debug')
def debug_routes():
    return {
        "static_files": os.listdir(STATIC_FOLDER),
        "template_files": os.listdir(TEMPLATE_FOLDER),
        "data.json_exists": os.path.exists(os.path.join(TEMPLATE_FOLDER, 'data.json')),
        "current_route": request.path
    }

if __name__ == '__main__':
    app.run(debug=True, port=5000)
