from flask import Flask, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
def home():
    return send_from_directory('../templates', 'index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('../static', filename)

def handler(request):
    path = request.path
    if path.startswith('/static/'):
        return serve_static(path.split('/static/')[1])
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "text/html"},
        "body": home().get_data().decode('utf-8')
    }
