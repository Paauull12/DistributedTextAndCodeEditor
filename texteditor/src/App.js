import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChooseChat from './components/ChooseChat'; // Import ChooseChat component
import MainContainer from './components/MainContainer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<ChooseChat />} /> 
            <Route
              path="/chat/:roomName"
              element={
                <MainContainer/>
              }
            />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
