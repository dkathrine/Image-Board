import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Forms/Register';
import Login from './pages/Forms/Login';
import Home from './pages/Home/Home';
import CreatePost from './pages/CreatePost/CreatePost';

function App() {

  document.title = "YIP! Your Image Board"

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
