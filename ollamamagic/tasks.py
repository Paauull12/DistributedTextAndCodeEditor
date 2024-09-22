import os
import requests
from celery import Celery
import json

OLLAMA_HOST = os.environ.get('OLLAMA_HOST', 'http://ollama:11434')
MODEL_NAME = 'tinyllama'

celery = Celery('tasks', broker='redis://redis:6379/0', backend='redis://redis:6379/0')

@celery.task
def get_model_info():
    try:
        response = requests.get(f"{OLLAMA_HOST}/api/show", params={"name": MODEL_NAME})
        if response.status_code == 200:
            model_info = response.json()
            return {"model": model_info['model']}
        else:
            return {"error": "Failed to retrieve model information"}
    except requests.RequestException as e:
        return {"error": str(e)}

import requests
from requests.exceptions import RequestException

@celery.task
def generate_response(prompt):
    try:
        # Print the prompt for debugging
        print(f"Prompt: {prompt}")
        
        # Send the request to the TinyOllama API
        response = requests.post(
            f"{OLLAMA_HOST}/api/generate",
            json={
                "model": MODEL_NAME,
                "prompt": prompt
            }
        )
        
        # Check if the request was successful
        if response.status_code == 200:
            try:
                # Attempt to parse the JSON response
                #response_data = response.json()
                # Extract the response, assuming 'response' key is correct
                json_objects = response.text.strip().split('\n')

                responses = []
                for json_str in json_objects:
                    try:
                        data = json.loads(json_str)
                        responses.append(data['response'])
                    except json.JSONDecodeError:
                        continue

                # Join the responses to form the complete message
                complete_message = ''.join(responses)
                return {"response": complete_message}
            except ValueError as e:
                # Handle JSON decoding errors
                return {"error": f"Invalid JSON response: {str(e)}"}
        else:
            return {"error": f"Failed to generate response. Status code: {response.status_code}"}
    except RequestException as e:
        # Handle request exceptions
        return {"error": f"Request failed: {str(e)}"}
