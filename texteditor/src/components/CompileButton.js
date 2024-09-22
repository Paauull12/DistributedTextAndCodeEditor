import React, { useState, useRef } from 'react';
import './ButtonForExplSumm.css';
import './DisplayText.css'; 

const CompileButton = ({ textRef, functionForUpdate }) => {
    const [prompt, setPrompt] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [error, setError] = useState('');
    const [stateForButton, setStateForButton] = useState('');
    const output = useRef('');
    const codeError = useRef('');
    const suggestions = useRef('');

  const someFunction = async () => {
    setError(''); // Resetăm eroarea la începutul fiecărei cereri
    setStateForButton("loading");
    const currentText = textRef.current;
    console.log("text from button " + currentText);
  
    let code = currentText
    let input = prompt

    let jsonObj = {
        code: code,
        input: prompt,
        getaihelp: isChecked
    };
    
    console.log("This shoudl be the input " + prompt);

    if (input === '') {
        jsonObj.input = prompt;
    }

    if (isChecked){
        jsonObj.getaihelp = 'true';
    }

    try {
      const response = await fetch('http://localhost:8080/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonObj),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result['output']);
      output.current = result['output'];

      codeError.current = result?.['error'] || '';
    
      suggestions.current = result?.['suggestion'] || '';

      setStateForButton('done')
    } catch (e) {
      console.error("There was a problem with the fetch operation: " + e.message);
      setError("An error occurred while generating the response. Please try again.");
    }
  };

  const anotherFunction = () => {
    // Open a new tab and name it "ResultWindow"
    const newTab = window.open("", "ResultWindow", "width=1000,height=800");

    // Check if the output, error, and suggestion exist
    const outputText = output?.current || "nothing to show";
    const errorText = codeError?.current || "nothing to show";
    const suggestionText = suggestions?.current || "nothing to show";

    if (newTab) {
        // Create HTML content with CSS to structure the output, errors, and suggestions
        const htmlContent = `
            <html>
                <head>
                    <title>Output Result</title>
                    <style>
                        body {
                            margin: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            background-color: #e0e0e0; /* Grey background */
                            font-family: Arial, sans-serif;
                        }
                        .container {
                            width: 80%;
                            background-color: white;
                            border-radius: 20px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            padding: 40px;
                            font-size: 18px;
                            color: #333;
                            line-height: 1.6;
                            text-align: left; /* Left-align the text */
                        }
                        .section {
                            margin-bottom: 20px;
                        }
                        .section-title {
                            font-weight: bold;
                            margin-bottom: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="section">
                            <div class="section-title">Output:</div>
                            <div>${outputText}</div>
                        </div>
                        <div class="section">
                            <div class="section-title">Errors:</div>
                            <div>${errorText}</div>
                        </div>
                        <div class="section">
                            <div class="section-title">Suggestions:</div>
                            <div>${suggestionText}</div>
                        </div>
                    </div>
                </body>
            </html>
        `;

        // Write the content to the new tab
        newTab.document.write(htmlContent);

        // Close the document to finish loading the content
        newTab.document.close();
    } else {
        console.log("Failed to open new tab");
    }
};


  return (
    <div className="expl-summ-container component3">
      <div className="expl-summ-card">
        <input
          type="text"
          placeholder="Enter your input here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="expl-summ-input"
        />
        <div className="expl-summ-checkbox-container">
          <input
            type="checkbox"
            id="advancedSettings"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="expl-summ-checkbox"
          />
          <label htmlFor="advancedSettings" className="expl-summ-checkbox-label">
            Use Ai if there are errors.
          </label>
        </div>
        <button onClick={someFunction} className="expl-summ-button">
            {stateForButton === 'loading' ? (
                <div className="loader"></div> 
            ) : (
                <p>Compile</p>
            )}
        </button>
        <div className='component3'></div>
        {stateForButton === 'done' ? (
            <button onClick={anotherFunction} className='expl-summ-button'>
                Check the result!
            </button>
        ):(<div></div>)}
        {error && <div className="expl-summ-error">{error}</div>}
      </div>
    </div>
  );
};

export default CompileButton;