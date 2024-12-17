import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase'; // Conexão com o Supabase
import '../css/AdminPanel.css';

const AdminPanel = () => {
  const [reports, setReports] = useState([]); // Relatórios
  const [users, setUsers] = useState([]); // Usuários
  const [selectedUser, setSelectedUser] = useState(null); // Usuário em edição

  // Carregar os dados do Supabase
  useEffect(() => {
    fetchReports();
    fetchUsers();
  }, []);

  // Buscar relatórios
  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select('id, nome_framework, data_avaliacao, usuarios (nome, email)');

      if (error) throw error;
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err.message);
    }
  };

  // Buscar usuários
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nome, email, username, is_part_of_company');

      if (error) throw error;
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err.message);
    }
  };

  // Excluir relatório
  const deleteReport = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        const { error } = await supabase.from('avaliacoes').delete().eq('id', id);
        if (error) throw error;
        alert('Report deleted successfully.');
        fetchReports();
      } catch (err) {
        console.error('Error deleting report:', err.message);
      }
    }
  };

  // Editar usuário
  const editUser = (user) => {
    setSelectedUser(user);
  };

  const updateUser = async () => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          nome: selectedUser.nome,
          email: selectedUser.email,
          username: selectedUser.username,
        })
        .eq('id', selectedUser.id);

      if (error) throw error;
      alert('User updated successfully.');
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err.message);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>

      {/* Tabela de Relatórios */}
      <section>
        <h3>Reports</h3>
        <table>
          <thead>
            <tr>
              <th>Framework</th>
              <th>User</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.nome_framework}</td>
                <td>{report.usuarios?.nome || 'Unknown'}</td>
                <td>{new Date(report.data_avaliacao).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => deleteReport(report.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Tabela de Usuários */}
      <section>
        <h3>Users</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>
                  <button onClick={() => editUser(user)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Formulário de Edição de Usuário */}
      {selectedUser && (
        <div className="edit-user">
          <h3>Edit User</h3>
          <input
            type="text"
            value={selectedUser.nome}
            onChange={(e) => setSelectedUser({ ...selectedUser, nome: e.target.value })}
            placeholder="Name"
          />
          <input
            type="email"
            value={selectedUser.email}
            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
            placeholder="Email"
          />
          <input
            type="text"
            value={selectedUser.username}
            onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
            placeholder="Username"
          />
          <button onClick={updateUser}>Save</button>
          <button onClick={() => setSelectedUser(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
