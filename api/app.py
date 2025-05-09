from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder="../public", template_folder="../templates")

@app.route('/')
def home():
    return send_from_directory(app.template_folder, 'index.html')

@app.route('/public/<path:filename>')
def serve_public(filename):
    return send_from_directory(app.static_folder, filename)

def handler(request):
    with app.app_context():
        path = request.path
        if path.startswith('/public/'):
            return serve_public(path.split('/public/')[1])
        response = home()
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "text/html"},
            "body": response.get_data().decode('utf-8')
        }

if __name__ == '__main__':
    app.run(port=3000)

@app.route('/debug')
def debug_routes():
    return {
        "static_files": os.listdir('../public'),
        "template_files": os.listdir('../templates'),
        "current_route": request.path
    }
