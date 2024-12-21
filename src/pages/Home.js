import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import '../css/Home.css';

const Home = ({ user, handleLogout }) => {
  const [rankings, setRankings] = useState([]); // Estado para rankings gerais
  const [userEvaluations, setUserEvaluations] = useState([]); // Estado para avaliações individuais do usuário
  const [uniqueFrameworks, setUniqueFrameworks] = useState([]); // Estado para frameworks únicos com médias

  const navigate = useNavigate();

  // Função para redirecionar para a página de comparação
  const handleGoToComparison = () => {
    navigate('/comparacaousuario'); // Altere '/comparacao' para o caminho da sua página de comparação
  };

  // Função para carregar os dados de rankings e frameworks
  useEffect(() => {
    const fetchFrameworkData = async () => {
      try {
        // Buscar os dados de critérios
        const { data: criterios, error: criteriosError } = await supabase
          .from('criterios')
          .select('id, peso, avaliacao_id');
        if (criteriosError) throw criteriosError;

        // Buscar os dados de subcritérios
        const { data: subcriterios, error: subcriteriosError } = await supabase
          .from('subcriterios')
          .select('id, nota, criterio_id');
        if (subcriteriosError) throw subcriteriosError;

        // Buscar as avaliações realizadas (frameworks)
        const { data: avaliacoes, error: avaliacoesError } = await supabase
          .from('avaliacoes')
          .select('id, nome_framework, data_avaliacao, usuarios (nome)');
        if (avaliacoesError) throw avaliacoesError;

        // Combinar os dados para calcular as médias
        const frameworkData = {}; // Objeto para armazenar frameworks agrupados
        const allRankings = []; // Array para rankings gerais

        avaliacoes.forEach((avaliacao) => {
          // Filtrar critérios da avaliação
          const criteriosDaAvaliacao = criterios.filter(
            (criterio) => criterio.avaliacao_id === avaliacao.id
          );

          let totalScore = 0;
          let totalWeight = 0;

          // Calcular notas ponderadas para cada critério
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

          const finalAverage = totalWeight > 0 ? totalScore / totalWeight : 0;

          // Adicionar ao ranking geral
          allRankings.push({
            frameworkName: avaliacao.nome_framework,
            averageScore: finalAverage.toFixed(2),
            user: avaliacao.usuarios?.nome || 'Unknown',
            date: new Date(avaliacao.data_avaliacao).toLocaleDateString(),
          });

          // Agrupar frameworks para cálculo de médias únicas
          if (!frameworkData[avaliacao.nome_framework]) {
            frameworkData[avaliacao.nome_framework] = {
              totalScore: finalAverage,
              count: 1,
            };
          } else {
            frameworkData[avaliacao.nome_framework].totalScore += finalAverage;
            frameworkData[avaliacao.nome_framework].count += 1;
          }
        });

        // Ordenar rankings gerais
        allRankings.sort((a, b) => b.averageScore - a.averageScore);
        setRankings(allRankings);

        // Calcular médias para frameworks únicos
        const aggregatedFrameworks = Object.entries(frameworkData).map(([name, data]) => ({
          frameworkName: name,
          averageScore: (data.totalScore / data.count).toFixed(2),
        }));
        setUniqueFrameworks(aggregatedFrameworks);
      } catch (err) {
        console.error('Error fetching and processing data:', err.message);
      }
    };

    const fetchUserEvaluations = async () => {
      try {
        // Buscar avaliações do usuário logado
        const { data, error } = await supabase
          .from('avaliacoes')
          .select('*')
          .eq('usuario_id', user.id);
        if (error) throw error;

        setUserEvaluations(data); // Atualizar estado com as avaliações do usuário
      } catch (err) {
        console.error('Error fetching user evaluations:', err.message);
      }
    };

    fetchFrameworkData(); // Carregar dados de frameworks
    if (user?.id) {
      fetchUserEvaluations(); // Carregar dados do usuário logado
    }
  }, [user.id]);

  const isAdmin = user?.role === 1; // Verificar se o usuário é administrador

  return (
    <div className="home-container">
      <h2>Welcome, {user.nome}!</h2>
      <p>Here you can efficiently manage and evaluate your frameworks.</p>
  
      <div className="home-buttons">
        <button onClick={() => navigate('/setup')} className="btn-primary">
          Start New Evaluation
        </button>
        <button onClick={() => navigate('/explanation')} className="btn-secondary">
          Explanation
        </button>
        {isAdmin && (
          <button onClick={() => navigate('/admin')} className="btn-admin">
            Go to Admin Panel
          </button>
        )}
        <button onClick={handleGoToComparison} className="btn-secondary">
          Compare Frameworks
        </button>
        <button onClick={handleLogout} className="btn-danger">
          Logout
        </button>
      </div>
  
      {/* Tabela de frameworks únicos com médias */}
      <h3>Overall Framework Rankings</h3>
      <table className="frameworks-table">
        <thead>
          <tr>
            <th>Framework</th>
            <th>e-CRF</th>
          </tr>
        </thead>
        <tbody>
          {uniqueFrameworks.length > 0 ? (
            uniqueFrameworks.map((framework, index) => (
              <tr key={index}>
                <td>{framework.frameworkName}</td>
                <td>{framework.averageScore}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No frameworks available.</td>
            </tr>
          )}
        </tbody>
      </table>
  
      {/* Tabela de rankings gerais */}
      <h3>Assessors' Assessment</h3>
      <table className="rank-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Framework</th>
            <th>e-CRF</th>
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
  
      {/* Tabela de avaliações do usuário */}
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
                        if (!evaluation.dados) {
                          throw new Error('No data available for this evaluation.');
                        }
                        const frameworksData = JSON.parse(evaluation.dados);
                        navigate('/relatorio', { state: { frameworksData } });
                      } catch (err) {
                        console.error('Invalid data format or missing data:', err.message);
                        alert('Unable to load the report. Data is invalid or missing.');
                      }
                    }}
                    className="btn-view"
                  >
                    View Report
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
