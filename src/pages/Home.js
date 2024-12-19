import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import '../css/Home.css';

const Home = ({ user, handleLogout }) => {
  const [rankings, setRankings] = useState([]); // Estado para o ranking geral dos frameworks
  const [userEvaluations, setUserEvaluations] = useState([]); // Estado para avaliações do usuário
  const navigate = useNavigate();
  // Função para redirecionar para a página de comparação
  const handleGoToComparison = () => {
  navigate('/comparacao'); // Altere '/comparacao' para o caminho da sua página de comparação
};



  // Carrega os rankings gerais e as avaliações do usuário do banco de dados
  useEffect(() => {
    const fetchFrameworkAverages = async () => {
      try {
        // Etapa 1: Buscar critérios com a tabela de avaliações
        const { data: criterios, error: criteriosError } = await supabase
          .from('criterios')
          .select('id, peso, avaliacao_id');
  
        if (criteriosError) throw criteriosError;
  
        // Etapa 2: Buscar subcritérios relacionados aos critérios
        const { data: subcriterios, error: subcriteriosError } = await supabase
          .from('subcriterios')
          .select('id, nota, criterio_id');
  
        if (subcriteriosError) throw subcriteriosError;
  
        // Etapa 3: Buscar avaliações (frameworks)
        const { data: avaliacoes, error: avaliacoesError } = await supabase
          .from('avaliacoes')
          .select('id, nome_framework, data_avaliacao, usuarios (nome)');
  
        if (avaliacoesError) throw avaliacoesError;
  
        // Combinar os dados localmente
        const combinedData = avaliacoes.map((avaliacao) => {
          const criteriosDaAvaliacao = criterios.filter(
            (criterio) => criterio.avaliacao_id === avaliacao.id
          );
  
          let totalScore = 0;
          let totalWeight = 0;
  
          criteriosDaAvaliacao.forEach((criterio) => {
            const subcriteriosDoCriterio = subcriterios.filter(
              (sub) => sub.criterio_id === criterio.id
            );
  
            const subScoreSum = subcriteriosDoCriterio.reduce(
              (sum, sub) => sum + parseFloat(sub.nota || 0),
              0
            );
  
            const subAverage = subScoreSum / subcriteriosDoCriterio.length || 0;
  
            totalScore += subAverage * (parseFloat(criterio.peso) || 1);
            totalWeight += parseFloat(criterio.peso) || 1;
          });
  
          const finalAverage = totalWeight > 0 ? (totalScore / totalWeight).toFixed(2) : '0.00';
  
          return {
            frameworkName: avaliacao.nome_framework,
            averageScore: parseFloat(finalAverage),
            user: avaliacao.usuarios?.nome || 'Unknown',
            date: new Date(avaliacao.data_avaliacao).toLocaleDateString(),
          };
        });
  
        // Ordena os dados pelo averageScore em ordem decrescente
        combinedData.sort((a, b) => b.averageScore - a.averageScore);
  
        setRankings(combinedData);
      } catch (err) {
        console.error('Error calculating framework averages:', err.message);
      }
    };
  
    const fetchUserEvaluations = async () => {
      try {
        // Busca apenas as avaliações do usuário logado
        const { data, error } = await supabase
          .from('avaliacoes')
          .select('*')
          .eq('usuario_id', user.id);
  
        if (error) throw error;
  
        setUserEvaluations(data); // Atualiza o estado com os dados do usuário
      } catch (err) {
        console.error('Error fetching user evaluations:', err.message);
      }
    };
  
    fetchFrameworkAverages();
    if (user?.id) {
      fetchUserEvaluations();
    }
  }, [user.id]); // Adiciona o ID do usuário como dependência
  
  
    // Verifica se o usuário é um admin
    const isAdmin = user?.role === 1;
  

// Função para deletar a avaliação
const deleteEvaluation = async (evaluationId) => {
  console.log('Deleting evaluation with ID:', evaluationId);  // Verifique o ID
  if (window.confirm('Are you sure you want to delete this evaluation?')) {
    try {
      const { error } = await supabase
        .from('avaliacoes')
        .delete()
        .eq('id', evaluationId); // Certifique-se de que o 'id' está correto no Supabase

      if (error) throw error; // Se houver erro no Supabase, ele será lançado aqui

      // Atualiza o estado local removendo a avaliação deletada
      setUserEvaluations((prevEvaluations) =>
        prevEvaluations.filter((evaluation) => evaluation.id !== evaluationId)
      );

      alert('Evaluation successfully deleted.');
    } catch (err) {
      console.error('Error deleting evaluation:', err.message);  // Log do erro
      alert('Failed to delete evaluation. Try again.');
    }
  }
};



  return (
    <div className="home-container">
      <h2>Welcome, {user.nome}!</h2>
      <p>Here you can efficiently manage and evaluate your frameworks.</p>

      <div className="home-buttons">
        {/* Botão para iniciar uma nova avaliação */}
        <button onClick={() => navigate('/setup')} className="btn-primary">
          Start New Evaluation
        </button>

        {/* Botão para a página de explicação */}
        <button 
            onClick={() => navigate('/explanation')} 
            className="btn-secondary"
            >
            Explanation
        </button>

        {/* Mostrar botão de Admin apenas para o Admin */}
        {isAdmin && (
          <button onClick={() => navigate('/admin')} className="btn-admin">
            Go to Admin Panel
          </button>
        )}

        {/* Botão para acessar a página de comparação */}
        <button 
            onClick={() => navigate('/comparacaousuario')} 
            className="btn-secondary"
            >
            Compare Frameworks
        </button>



        {/* Botão de Logout */}
        <button onClick={handleLogout} className="btn-danger">
          Logout
        </button>
      </div>

      {/* Tabela com o ranking geral */}
      <h3>Overall Framework Rankings</h3>
        <table className="rank-table">
        <thead>
            <tr>
            <th>Position</th>
            <th>Framework</th>
            <th>Average Score</th>
            <th>User</th>
            <th>Date</th>
            </tr>
        </thead>
        <tbody>
            {rankings.length > 0 ? (
            rankings.map((framework, index) => (
                <tr key={index}>
                <td>{index + 1}</td>
                <td>{framework.frameworkName}</td>
                <td>{framework.averageScore}</td>
                <td>{framework.user}</td>
                <td>{framework.date}</td>
                </tr>
            ))
            ) : (
            <tr>
                <td colSpan="5">No rankings available.</td>
            </tr>
            )}
        </tbody>
        </table>





      {/* Tabela com avaliações realizadas pelo usuário */}
      <h3>Your Evaluations</h3>
      <table className="user-evals-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Evaluated Frameworks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userEvaluations.length > 0 ? (
            userEvaluations.map((evaluation, index) => (
              <tr key={index}>
                <td>{new Date(evaluation.data_avaliacao).toLocaleDateString()}</td>
                <td>{evaluation.nome_framework}</td>
                <td>
                <button
                    onClick={() => {
                        try {
                        // Verifica se 'evaluation.dados' existe antes de prosseguir
                        if (!evaluation.dados) {
                            throw new Error('No data available for this evaluation.');
                        }

                        // Faz o parse dos dados JSON salvos
                        const frameworksData = JSON.parse(evaluation.dados);

                        // Redireciona para a página de relatório com os dados no state
                        navigate('/relatorio', { state: { frameworksData } });
                        } catch (err) {
                        // Loga o erro no console e exibe um alerta amigável ao usuário
                        console.error('Invalid data format or missing data:', err.message);
                        alert('Unable to load the report. Data is invalid or missing.');
                        }
                    }}
                    className="btn-view"
                    >
                    View Report
                    </button>


                  <button
                    onClick={() => deleteEvaluation(evaluation.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">You haven't performed any evaluations yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
