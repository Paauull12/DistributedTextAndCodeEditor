#!/bin/bash
echo "Preloading tinyllama model..."
ollama run tinyllama "This is a test prompt to ensure the model is loaded."
ollama run deepseek-coder "This is a test prompt to ensure the model is loaded."
echo "Model preloaded successfully."