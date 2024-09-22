from flask import Flask, request, jsonify
from celery import Celery
import tasks
from flask_cors import CORS

app = Flask(__name__)
app.config['CELERY_BROKER_URL'] = 'redis://redis:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://redis:6379/0'
CORS(app)

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

@app.route('/model', methods=['GET'])
def get_model():
    print("here mate")
    task = tasks.get_model_info.delay()
    result = task.get(timeout=10)
    return jsonify(result)

@app.route('/generate', methods=['POST'])
def generate_response():
    data = request.json
    if not data or 'prompt' not in data:
        return jsonify({"error": "Missing 'prompt' in request body"}), 400

    prompt = data['prompt']
    print(prompt)
    task = tasks.generate_response.delay(prompt)
    result = task.get(timeout=30)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4040)