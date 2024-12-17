import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import FrameworkSetup from './pages/FrameworkSetup';
import Avaliacao from './pages/Avaliacao';
import Relatorio from './pages/Relatorio';
import Explanation from './pages/Explicacao';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [user, setUser] = useState(null);
  const [frameworks, setFrameworks] = useState([]);

  // Carregar usuário do localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/home" element={user ? <Home user={user} handleLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route
          path="/setup"
          element={user ? <FrameworkSetup onFrameworksSubmit={(data) => setFrameworks(data)} /> : <Navigate to="/" />}
        />
        <Route
          path="/avaliacao"
          element={user ? <Avaliacao user={user} frameworks={frameworks} /> : <Navigate to="/" />}
        />
        <Route path="/explanation" element={<Explanation />} />

        <Route path="/relatorio" element={<Relatorio />} />
        <Route path="/signup" element={<Cadastro />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/admin" element={<AdminPanel />} />

      </Routes>
    </Router>
  );
}

export default App;
