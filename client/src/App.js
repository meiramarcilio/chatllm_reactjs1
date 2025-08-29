import './App.css';
import Chat from './Chat';
import Summarizer from './Summarizer';
import {BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <header className="App-header">
        <Header />
      </header>
      {/* Routes define which component to render for each URL */}
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/summarizer" element={<Summarizer />} />
      </Routes>
    </BrowserRouter>
  );
}

function Header(){
  return (
    <ul class="nav">
      <li>
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Chat</NavLink>
      </li>
      <li>
        <NavLink to="/summarizer" className={({ isActive }) => isActive ? 'active' : ''}>Web Summarizer</NavLink>
      </li>
    </ul>
  );
}
export default App;
