import React, { useEffect, useState } from 'react';
import './DisplayText.css'; // Import the CSS file for styling

const DisplayText = ({ textRef }) => {
  const [displayText, setDisplayText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateText = () => {
      if (textRef.current !== undefined) {
        setDisplayText(textRef.current);
        setLoading(false); // Stop loading when text is updated
      }
    };

    updateText();

    const intervalId = setInterval(updateText, 100);

    return () => clearInterval(intervalId);
  }, [textRef]);

  return (
    <div>
      <h2>Result from AI:</h2>
      <br />
      {displayText === 'loading' ? (
        <div className="loader"></div> 
      ) : (
        <p>{displayText}</p> 
      )}
    </div>
  );
};

export default DisplayText;
