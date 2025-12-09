import { Component, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css'
import Mainpage from './pages/MainPage.jsx';
import ServicePage from './pages/ServicePage.jsx';
import DetailServicePage from './pages/DetailServicePage.jsx';
import AdviserProfilePage from './pages/AdviserProfilePage.jsx';
import Login from './pages/LoginPage.jsx';
import Register from './pages/RegisterPage.jsx';
import Community from './pages/CommunityPage.jsx';

function App() {
  const [count, setCount] = useState(0)
  const apiURL = import.meta.env.VITE_API_URL;
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/service" element={<ServicePage />} />
        <Route path="/detail" element={<DetailServicePage />} />
        <Route path="/AdviserProfile" element={<AdviserProfilePage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
