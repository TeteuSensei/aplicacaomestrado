import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import '../css/ComparacaoUsuarios.css';
import { useLocation, useNavigate } from 'react-router-dom'; // Verifique se está correto

const AvaliacoesPage = () => {
  const [rankings, setRankings] = useState([]);
  const [selectedEvaluations, setSelectedEvaluations] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [criterios, setCriterios] = useState([]);
  const [subcriterios, setSubcriterios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'averageScore', direction: 'desc' });
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/home'); // Use navigate para ir para a página inicial
  };

  // Fetch data from Supabase
  useEffect(() => {
    const fetchFrameworkAverages = async () => {
      try {
        const { data: criteriosData, error: criteriosError } = await supabase
          .from('criterios')
          .select('id, peso, titulo, avaliacao_id');
        if (criteriosError) throw criteriosError;

        const { data: subcriteriosData, error: subcriteriosError } = await supabase
          .from('subcriterios')
          .select('id, nota, titulo, criterio_id');
        if (subcriteriosError) throw subcriteriosError;

        const { data: avaliacoesData, error: avaliacoesError } = await supabase
          .from('avaliacoes')
          .select('id, nome_framework, data_avaliacao, usuarios (nome)');
        if (avaliacoesError) throw avaliacoesError;

        const combinedData = avaliacoesData.map((avaliacao) => {
          const criteriosDaAvaliacao = criteriosData.filter(
            (criterio) => criterio.avaliacao_id === avaliacao.id
          );

          let totalScore = 0;
          let totalWeight = 0;

          criteriosDaAvaliacao.forEach((criterio) => {
            const subcriteriosDoCriterio = subcriteriosData.filter(
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

          const finalAverage =
            totalWeight > 0 ? (totalScore / totalWeight).toFixed(2) : '0.00';

          return {
            frameworkName: avaliacao.nome_framework,
            averageScore: parseFloat(finalAverage),
            user: avaliacao.usuarios?.nome || 'Unknown',
            date: new Date(avaliacao.data_avaliacao).toLocaleDateString(),
            avaliacaoId: avaliacao.id,
          };
        });

        combinedData.sort((a, b) => b.averageScore - a.averageScore);

        setRankings(combinedData);
        setCriterios(criteriosData);
        setSubcriterios(subcriteriosData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err.message);
      }
    };

    fetchFrameworkAverages();
  }, []);

  // Handle evaluation selection
  const handleSelectEvaluation = (avaliacaoId) => {
    setSelectedEvaluations((prev) =>
      prev.includes(avaliacaoId)
        ? prev.filter((id) => id !== avaliacaoId)
        : [...prev, avaliacaoId]
    );
  };

  // Generate comparison data
  const handleCompareSelected = () => {
    if (selectedEvaluations.length < 2) {
      console.warn('Select at least two evaluations to compare.');
      return;
    }

    const comparison = selectedEvaluations.map((evaluationId) => {
      const criteriosDaAvaliacao = criterios.filter(
        (criterio) => criterio.avaliacao_id === evaluationId
      );

      let totalScore = 0;
      let totalWeight = 0;

      // Build criteriosDetails and comparisonDetails
      const criteriosDetails = criteriosDaAvaliacao.map((criterio) => {
        const weight = parseFloat(criterio.peso) || 1;
        const subcriteriosDoCriterio = subcriterios.filter(
          (sub) => sub.criterio_id === criterio.id
        );

        const subScoreSum = subcriteriosDoCriterio.reduce(
          (sum, sub) => sum + parseFloat(sub.nota || 0),
          0
        );
        const subAverage = subScoreSum / subcriteriosDoCriterio.length || 0;

        totalScore += subAverage * weight;
        totalWeight += weight;

        return {
          criterio: criterio.titulo || `Criterion ${criterio.id}`,
          nota: subAverage.toFixed(2),
          subcriterios: subcriteriosDoCriterio.map((sub) => ({
            titulo: sub.titulo || `Subcriterion ${sub.id}`,
            nota: sub.nota || 'N/A',
          })),
        };
      });

      const finalScore = totalWeight > 0 ? (totalScore / totalWeight).toFixed(2) : '0.00';

      const framework = rankings.find((ranking) => ranking.avaliacaoId === evaluationId);

      return {
        frameworkName: framework ? framework.frameworkName : `Framework ${evaluationId}`,
        user: framework ? framework.user : 'Unknown User',
        criteriosDetails,
        finalScore,
      };
    });

    setComparisonData(comparison);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  
    const sortedRankings = [...rankings].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setRankings(sortedRankings);
  };
  
  

  return (
    <div className="container">
      <h1>Evaluation Rankings</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Rankings Table */}
          <table className="comparison-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('frameworkName')}>
                  Framework {sortConfig.key === 'frameworkName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('averageScore')}>
                  Average Score {sortConfig.key === 'averageScore' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th>User</th>
                <th onClick={() => handleSort('dateSortable')}>
                  Date {sortConfig.key === 'dateSortable' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((ranking) => (
                <tr key={ranking.avaliacaoId}>
                  <td>{ranking.frameworkName}</td>
                  <td>{ranking.averageScore}</td>
                  <td>{ranking.user}</td>
                  <td>{ranking.date}</td>
                  <td>
                    <input
                      type="checkbox"
                      onChange={() => handleSelectEvaluation(ranking.avaliacaoId)}
                      checked={selectedEvaluations.includes(ranking.avaliacaoId)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


          <button onClick={handleCompareSelected} disabled={selectedEvaluations.length < 2}>
            Compare Selected
          </button>

          <button onClick={goToHome}>Home</button>


          {/* Criteria Scores Table */}
          {comparisonData.length > 0 && (
            <>
              <h2>Criteria Scores</h2>
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Criterion</th>
                    {comparisonData.map((framework) => (
                      <th key={framework.frameworkName}>
                        {framework.user} - {framework.frameworkName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData[0]?.criteriosDetails.map((criterio, idx) => (
                    <tr key={idx}>
                      <td>{criterio.criterio}</td>
                      {comparisonData.map((framework) => (
                        <td key={framework.frameworkName}>
                          {framework.criteriosDetails[idx]?.nota || 'N/A'}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td style={{ fontWeight: 'bold' }}>Final Score</td>
                    {comparisonData.map((framework) => (
                      <td key={framework.frameworkName} style={{ fontWeight: 'bold' }}>
                        {framework.finalScore}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>

              {/* Subcriteria Scores Table */}
              <h2>Subcriteria Scores</h2>
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Criterion/Subcriterion</th>
                    {comparisonData.map((framework) => (
                      <th key={framework.frameworkName}>
                        {framework.user} - {framework.frameworkName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData[0]?.criteriosDetails.map((criterio, idx) => (
                    <React.Fragment key={idx}>
                      <tr>
                        <td style={{ fontWeight: 'bold' }}>{criterio.criterio}</td>
                        {comparisonData.map(() => (
                          <td key={Math.random()}></td>
                        ))}
                      </tr>
                      {criterio.subcriterios.map((subcriterio, subIdx) => (
                        <tr key={subIdx}>
                          <td>{subcriterio.titulo}</td>
                          {comparisonData.map((framework) => (
                            <td key={framework.frameworkName}>
                              {framework.criteriosDetails[idx]?.subcriterios[subIdx]?.nota || 'N/A'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AvaliacoesPage;
