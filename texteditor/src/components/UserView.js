import React, { useEffect, useState } from 'react';  
import { useParams } from 'react-router-dom';
import axios from 'axios';  

function UserView() {
    const { roomName } = useParams();
    const [username, setUsername] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token');

        const getUsername = async () => {
            try {
                const response = await axios.get('http://master_paul:4050/getusername', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                return response.data.username;  
            } catch (error) {
                console.error('Error fetching data:', error);  
                return "_";  
            }
        };

        getUsername().then(uname => {
            setUsername(uname);
        });
        
    }, []);  

    return (
        <div>
            <p>The room name is: {roomName}</p>
            <br />
            <p>You are logged in as: {username}</p>
        </div>
    );
}

export default UserView;
