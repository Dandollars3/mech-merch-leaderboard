# api/app.py
from flask import Flask, render_template, jsonify, request
import os, json

BASE = os.path.dirname(os.path.abspath(__file__))
TPL  = os.path.join(BASE, '../templates')
STA  = os.path.join(BASE, '../static')

app = Flask(__name__, template_folder=TPL, static_folder=STA)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/leaderboard')
def leaderboard():
    try:
        with open(os.path.join(TPL, 'data.json')) as f:
            return jsonify(json.load(f))
    except FileNotFoundError:
        return jsonify({"error": "data.json not found"}), 404

@app.route('/debug')
def debug_routes():
    return {
        "static": os.listdir(STA),
        "templates": os.listdir(TPL),
        "data.json_exists": os.path.exists(os.path.join(TPL, 'data.json')),
        "route": request.path
    }

if __name__ == '__main__':
    app.run(debug=True, port=5000)
