import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import '../css/Login.css';

const Login = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para navegação

  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Busca usuário no Supabase
      const { data: users, error } = await supabase
        .from('usuarios')
        .select('*')
        .or(`username.eq.${identifier},email.eq.${identifier}`);

      if (error) throw error;

      if (!users || users.length === 0) {
        setError('User not found.');
        return;
      }

      const user = users[0];

      // Validação de senha simples (recomendo bcrypt no futuro)
      if (user.senha === password) {
        console.log('Authenticated user:', user);
        onLogin(user); // Salva o usuário no estado global
        navigate('/home'); // Redireciona para a página inicial
      } else {
        setError('Incorrect password.');
      }
    } catch (err) {
      console.error('Login error:', err.message);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Username or Email:
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            placeholder="Enter your username or email"
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
      <p>
        Don’t have an account?{' '}
        <button onClick={() => navigate('/signup')} className="signup-link">
          Sign up here
        </button>
      </p>
    </div>
  );
};

export default Login;
