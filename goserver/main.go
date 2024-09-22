package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"strconv"
)

type Request struct {
	Code  string `json:"code"`
	Input string `json:"input"`
	GetHelp bool `json:"getaihelp"`
}

type Response struct {
	Output     string `json:"output"`
	Error      string `json:"error,omitempty"`
	Suggestion string `json:"suggestion,omitempty"`
}

type ResponseModel struct {
	Model     string `json:"model"`
	CreatedAt string `json:"created_at"`
	Response  string `json:"response"`
	Done      bool   `json:"done"`
}

func main() {
	http.HandleFunc("/compile", handleRequest)
	fmt.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe("0.0.0.0:8080", nil))
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case "GET":
		handleGet(w, r)
	case "POST":
		handlePost(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func handleGet(w http.ResponseWriter, r *http.Request) {
	response := Response{Output: "Hello from GET request!"}
	json.NewEncoder(w).Encode(response)
}

func handlePost(w http.ResponseWriter, r *http.Request) {
	var req Request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Error decoding JSON request", http.StatusBadRequest)
		return
	}
	fmt.Println(req.Input)
	output, err, suggestion := compileCppAndRun(req.Code, req.Input)
	response := Response{Output: output, Suggestion: suggestion}
	if err != nil {
		response.Error = err.Error()
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func compileCppAndRun(code, input string) (string, error, string) {
	fmt.Println("This is the input: " + input)
	tmpDir, err := ioutil.TempDir("", "cpp-exec")
	if err != nil {
		return "", fmt.Errorf("failed to create temp dir: %v", err), ""
	}
	defer os.RemoveAll(tmpDir)

	sourcePath := filepath.Join(tmpDir, "main.cpp")
	if err := ioutil.WriteFile(sourcePath, []byte(code), 0644); err != nil {
		return "", fmt.Errorf("failed to write source file: %v", err), ""
	}

	outputPath := filepath.Join(tmpDir, "main")
	compileCmd := exec.Command("g++", sourcePath, "-o", outputPath)
	if compileOutput, err := compileCmd.CombinedOutput(); err != nil {
		return "", fmt.Errorf("compilation failed: %v\n%s", err, compileOutput), getSuggestion(code, err)
	}


	inputNumbers := []int{}
	for _, s := range strings.Fields(input) {
		n, err := strconv.Atoi(s)
		if err != nil {
			return "", fmt.Errorf("invalid input: %s is not a number", s), ""
		}
		inputNumbers = append(inputNumbers, n)
	}

	// Prepare input as a string of space-separated numbers
	inputStr := strings.Trim(strings.Join(strings.Fields(fmt.Sprint(inputNumbers)), " "), "[]")

	cmd := exec.Command(outputPath)
	cmd.Stdin = strings.NewReader(inputStr)
	runOutput, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("execution failed: %v\n%s", err, runOutput), getSuggestion(code, err)
	}

	return string(runOutput), nil, ""
}

func getSuggestion(code string, err error) string {
	url := "http://ollama:11434/api/generate"
	model := "deepseek-coder"
	prompt := "Tis is the error: " + fmt.Sprintf("%s",err.Error()) + " and this is the code fix it and return me just the correct code " + code

	postData := map[string]interface{}{
		"model":  model,
		"prompt": prompt,
	}

	jsonBody, err := json.Marshal(postData)
	if err != nil {
		return ""
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		return ""
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		return ""
	}
	defer response.Body.Close()

	data, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return ""
	}

	jsonLines := strings.Split(strings.TrimSpace(string(data)), "\n")
	combinedResponse := ""

	type OllamaResponse struct {
		Model     string `json:"model"`
		CreatedAt string `json:"created_at"`
		Response  string `json:"response"`
		Done      bool   `json:"done"`
	}

	for _, line := range jsonLines {
		var resp OllamaResponse
		err := json.Unmarshal([]byte(strings.TrimSpace(line)), &resp)
		if err != nil {
			log.Printf("Error parsing JSON: %v", err)
			continue
		}
		combinedResponse += resp.Response
	}

	return string(combinedResponse)
}