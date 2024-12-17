import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegação entre páginas
import { supabase } from '../services/supabase'; // Cliente Supabase configurado
import '../css/Cadastro.css'; // Arquivo CSS

const Cadastro = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPartOfCompany, setIsPartOfCompany] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [error, setError] = useState(null); // Gerenciamento de erros
  const [success, setSuccess] = useState(null); // Mensagem de sucesso

  const navigate = useNavigate(); // Hook de navegação

  // Função para lidar com o cadastro do usuário
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validação dos campos
    if (!name || !username || !email || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      // Enviar dados para a tabela 'usuarios' no Supabase
      const { error } = await supabase.from('usuarios').insert({
        nome: name,
        username: username,
        email: email,
        senha: password, // Recomendo usar criptografia no backend
        is_part_of_company: isPartOfCompany,
        company_name: isPartOfCompany ? companyName : null,
        sector: isPartOfCompany ? sector : null,
        roles_id: 3, // ID padrão para "usuario"
        criado_em: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      setSuccess('User registered successfully!');
      // Redireciona para a página de login após o cadastro
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Registration error:', err.message);
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your full name"
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Choose a username"
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Choose a password"
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={isPartOfCompany}
            onChange={(e) => setIsPartOfCompany(e.target.checked)}
          />
          Part of a company/sector?
        </label>
        {isPartOfCompany && (
          <>
            <label>
              Company Name:
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                placeholder="Enter company name"
              />
            </label>
            <label>
              Sector:
              <input
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                required
                placeholder="Enter sector"
              />
            </label>
          </>
        )}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <button onClick={() => navigate('/')} className="login-link">
          Log in here
        </button>
      </p>
    </div>
  );
};

export default Cadastro;
