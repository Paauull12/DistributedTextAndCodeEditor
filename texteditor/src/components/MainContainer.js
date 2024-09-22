import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import MyEditor from './myEditor';
import UserView from './UserView'
import './MainContainer.css'; // We'll create this CSS file for styling
import ButtonForExplSumm from './FunnyButton';
import DisplayText from './FunnyDisplay';
import CompileButton from './CompileButton'

function MainContainer() {
  const { roomName } = useParams();
  const currentTextRef = useRef(''); // Use ref for currentText
  const uploadTextRef = useRef('Nothing yet');

  const handleUploadText = (text) => {
    uploadTextRef.current = text; // Update uploadTextRef with currentTextRef
    console.log("Upload Text updated to:", uploadTextRef.current);
  };

  const handleCurrentText = (text) => {
    currentTextRef.current = text; // Update uploadTextRef with currentTextRef
    console.log("Current Text updated to:", text);
  };

  return (
    <div className="main-container">
      <div className="general-container">
        <UserView roomName={roomName} />
        <din className='component3'>
        <ButtonForExplSumm textRef={currentTextRef} functionForUpdate={handleUploadText}/>
        </din>
        <CompileButton textRef={currentTextRef} functionForUpdate={handleUploadText}/>
      </div>
      <div className="editor-container">
        <div className='component1'>
        <MyEditor roomName={roomName} functionToUpdate={handleCurrentText}/>
        </div>
        <div className='component2'>
        <DisplayText textRef={uploadTextRef}/>
        </div>
      </div>
    </div>
  );
}

export default MainContainer;