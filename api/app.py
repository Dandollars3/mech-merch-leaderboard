from flask import Flask, send_from_directory, request, json
import os
app = Flask(__name__, static_folder="public", template_folder="templates")

@app.route('/')
def home():
    return send_from_directory(app.template_folder, 'index.html')

@app.route('/leaderboard')
def leaderboard():
    data_path = os.path.join(app.template_folder, 'data.json')
    try:
        with open(data_path) as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": "data.json not found"}, 404

@app.route('/public/<path:filename>')
def serve_public(filename):
    return send_from_directory(app.static_folder, filename)

def handler(request):
    with app.app_context():
        path = request.path
        if path.startswith('/public/'):
            return serve_public(path.split('/public/')[1])
        if path == '/leaderboard':
            return leaderboard()
        response = home()
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "text/html"},
            "body": response.get_data().decode('utf-8')
        }

@app.route('/debug')
def debug_routes():
    return {
        "static_files": os.listdir(app.static_folder),
        "template_files": os.listdir(app.template_folder),
        "data.json_exists": os.path.exists(os.path.join(app.template_folder, 'data.json')),
        "current_route": request.path
    }

if __name__ == '__main__':
    app.run(port=5000)  # Changed to 5000 to avoid Vercel conflict
