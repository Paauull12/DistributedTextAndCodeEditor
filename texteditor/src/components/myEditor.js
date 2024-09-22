import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import { useParams } from 'react-router-dom';
import * as Y from 'yjs'; // Import Yjs
import { WebsocketProvider } from 'y-websocket'; // WebSocket connector for Yjs
import { QuillBinding } from 'y-quill'; // CRDT binding for Quill
import 'react-quill/dist/quill.snow.css';
import './myEditor.css';
import { useNavigate } from 'react-router-dom';

const modules = {
  syntax: true, // Keep syntax highlighting if needed
  toolbar: false,
};

const formats = [];

function MyEditor({ functionToUpdate }) {
  const { roomName } = useParams();
  const quillRef = useRef(null);
  const navigate = useNavigate();
  const wsRef = useRef(null);
  const ydocRef = useRef(null); // Reference for Yjs document
  const providerRef = useRef(null); // Reference for WebSocket provider
  const bindingRef = useRef(null); // Reference for Yjs binding to Quill


  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(`ws://master_paul:8000/ws/chat/${roomName}/?token=${token}`);
    wsRef.current = new WebSocket(`ws://master_paul:8000/ws/chat/${roomName}/?token=${token}`);

    // Initialize Yjs document
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // Connect to the WebSocket server with Yjs localhost 1234
    const provider = new WebsocketProvider('ws://localhost:1234', roomName, ydoc);
    providerRef.current = provider;

    provider.on('status', (event) => {
      console.log('Yjs WebSocket status:', event.status); // Logs connection status
    });

    if (quillRef.current) {
      const editor = quillRef.current.getEditor();

      const ytext = ydoc.getText('quill');

      const binding = new QuillBinding(ytext, editor);
      bindingRef.current = binding;

      ytext.observe(() => {
        functionToUpdate(ytext.toString());
        console.log(ytext.toString());
      });
    }

    wsRef.current.onopen = () => {
      console.log('WebSocket connection established.');
    };

    wsRef.current.onmessage = (event) => {
      console.log('Message received:', event);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      if(token === null)
        navigate('/');
    };

    wsRef.current.onclose = (event) => {
        console.log('WebSocket connection closed cleanly:', event.reason);

    };

    return () => {
      // Clean up resources on unmount
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (providerRef.current) {
        providerRef.current.destroy();
      }
      if (ydocRef.current) {
        ydocRef.current.destroy();
      }
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
    };
  }, [roomName]);

  return (
    <div className="component">
      <ReactQuill 
        ref={quillRef}
        value={''} // No need to manage the value locally, Yjs handles it
        modules={modules}
        formats={formats}
        theme="snow"
      />
    </div>
  );
}

export default MyEditor;
