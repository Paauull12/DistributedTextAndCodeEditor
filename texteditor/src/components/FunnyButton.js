import React, { useState } from 'react';
import './ButtonForExplSumm.css';

const ButtonForExplSumm = ({ textRef, functionForUpdate }) => {
  const [prompt, setPrompt] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState('');

  const handleClick = async () => {
    setError(''); // Resetăm eroarea la începutul fiecărei cereri
    functionForUpdate("loading");
    const currentText = textRef.current;
    console.log("text from button " + currentText);
  
    let body = "Use at most 20 words for your response. This is the prompt: " + prompt;
    if(prompt === '')
      body += "If you have context for this prompt you should see if the context is formed of code or text. If it's formed of code just explain it, if it's text just summarize it. If there's no context for this just say hello";
    if(isChecked)
      body += " This is the context of the prompt: " + textRef.current;

    try {
      const response = await fetch('http://localhost:4040/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: body || "say hello" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result['response']);
      functionForUpdate(result['response']);
    } catch (e) {
      console.error("There was a problem with the fetch operation: " + e.message);
      setError("An error occurred while generating the response. Please try again.");
    }
  };

  return (
    <div className="expl-summ-container component3">
      <div className="expl-summ-card">
        <input
          type="text"
          placeholder="Enter your prompt here"
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
            Use collaborative work
          </label>
        </div>
        <button onClick={handleClick} className="expl-summ-button">
          Generate Explanation/Summary
        </button>
        {error && <div className="expl-summ-error">{error}</div>}
      </div>
    </div>
  );
};

export default ButtonForExplSumm;