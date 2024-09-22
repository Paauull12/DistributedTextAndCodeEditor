from kombu import Queue

broker_url = 'redis://redis:6379/0'
result_backend = 'redis://redis:6379/0'

task_queues = (
    Queue('mistral_queue', routing_key='mistral.#'),
)

task_routes = {
    'tasks.get_model_info': {'queue': 'mistral_queue'},
    'tasks.generate_response': {'queue': 'mistral_queue'},
}

worker_concurrency = 3