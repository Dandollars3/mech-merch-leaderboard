from flask import Flask, send_from_directory, request
import os

app = Flask(__name__, static_folder="../static", template_folder="../templates")

@app.route('/')
def home():
    return send_from_directory(app.template_folder, 'index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

def handler(request):
    with app.app_context():
        path = request.path
        if path.startswith('/static/'):
            return serve_static(path.split('/static/')[1])
        response = home()
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "text/html"},
            "body": response.get_data().decode('utf-8')
        }

# For local testing
if __name__ == '__main__':
    app.run(port=3000)
