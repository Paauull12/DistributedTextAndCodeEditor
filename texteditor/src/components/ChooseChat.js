import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChooseChat() {
  const [newRoomName, setNewRoomName] = useState('');
  const navigate = useNavigate(); // Hook to navigate to the chatroom

  const handleJoinRoom = (roomName) => {
    // Navigate to the selected chatroom
    navigate(`/chat/${roomName}`);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoomName) {
      navigate(`/chat/${newRoomName}`);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Choose or Create a Chatroom</h2>
      
      <div className="list-group mb-4">
        <h4>Join an existing chatroom:</h4>
        <button
          className="list-group-item list-group-item-action"
          onClick={() => handleJoinRoom('General')}
        >
          General
        </button>
        <button
          className="list-group-item list-group-item-action"
          onClick={() => handleJoinRoom('Sports')}
        >
          Sports
        </button>
        <button
          className="list-group-item list-group-item-action"
          onClick={() => handleJoinRoom('Technology')}
        >
          Technology
        </button>
      </div>

      <div>
        <h4>Create a new chatroom:</h4>
        <form onSubmit={handleCreateRoom} className="d-flex">
          <input
            type="text"
            className="form-control"
            placeholder="Enter room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary ms-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChooseChat;
