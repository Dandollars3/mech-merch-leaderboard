from flask import Flask, render_template, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/leaderboard')
def leaderboard():
    # Remove comma after the list - it was creating a tuple
    communities = ["Aerospace", "Air_Con", "Automobile", "Energy", "Manufacturing"]
    purchases = [9, 3, 5, 2, 6]
    colors = ['#1b1b1b', '#246c9d', '#2f3750', '#237623', '#616977']

    return jsonify({
        'communities': communities,  # Fixed typo (was 'communities')
        'purchases': purchases,
        'colors': colors
    })


if __name__ == '__main__':
    app.run(debug=True)
