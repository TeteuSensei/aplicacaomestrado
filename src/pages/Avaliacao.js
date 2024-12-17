import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase'; // Configuração do Supabase
import '../css/Avaliacao.css'; // Arquivo CSS

const Avaliacao = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Recebe a lista de frameworks a partir do state
  const { frameworks } = location.state || { frameworks: [] };

  // Inicializa o estado dos frameworks para avaliação
  const [frameworksData, setFrameworks] = useState(
    frameworks.map((framework) => ({
      frameworkName: framework,
      criteria: [
        {
          id: 1,
          title: 'Cost',
          weight: 'Medium Priority',
          subcriteria: [
            { title: 'Implementation', score: '', weight: 'Medium Priority' },
            { title: 'License', score: '', weight: 'Medium Priority' },
            { title: 'Training', score: '', weight: 'Medium Priority' },
            { title: 'Maintenance', score: '', weight: 'Medium Priority' },
            { title: 'Consulting', score: '', weight: 'Medium Priority' },
          ],
        },
        {
          id: 2,
          title: 'Information Security',
          weight: 'Medium Priority',
          subcriteria: [
            { title: 'Data Protection', score: '', weight: 'Medium Priority' },
            { title: 'Intrusion Detection', score: '', weight: 'Medium Priority' },
            { title: 'Incident Response', score: '', weight: 'Medium Priority' },
            { title: 'Recovery', score: '', weight: 'Medium Priority' },
            { title: 'Prevention', score: '', weight: 'Medium Priority' },
          ],
        },
        {
          id: 3,
          title: 'Efficiency',
          weight: 'Medium Priority',
          subcriteria: [
            { title: 'Resource Optimization', score: '', weight: 'Medium Priority' },
            { title: 'Response Time', score: '', weight: 'Medium Priority' },
            { title: 'Automation', score: '', weight: 'Medium Priority' },
            { title: 'Scalability', score: '', weight: 'Medium Priority' },
            { title: 'Integration', score: '', weight: 'Medium Priority' },
          ],
        },
        {
          id: 4,
          title: 'Performance',
          weight: 'Medium Priority',
          subcriteria: [
            { title: 'Effectiveness of Security Measures', score: '', weight: 'Medium Priority' },
            { title: 'Threat Detection Rate', score: '', weight: 'Medium Priority' },
            { title: 'Risk Mitigation', score: '', weight: 'Medium Priority' },
            { title: 'Impact on Operation', score: '', weight: 'Medium Priority' },
            { title: 'Recovery Time', score: '', weight: 'Medium Priority' },
          ],
        },
        {
          id: 5,
          title: 'Complexity',
          weight: 'Medium Priority',
          subcriteria: [
            { title: 'Ease of Implementation', score: '', weight: 'Medium Priority' },
            { title: 'Learning Curve', score: '', weight: 'Medium Priority' },
            { title: 'Technical Requirements', score: '', weight: 'Medium Priority' },
            { title: 'Compatibility with Existing Systems', score: '', weight: 'Medium Priority' },
            { title: 'Maintenance Complexity', score: '', weight: 'Medium Priority' },
          ],
        },
        {
          id: 6,
          title: 'Flexibility/Adaptability',
          weight: 'Medium Priority',
          subcriteria: [
            { title: 'Adaptation to Different Sectors', score: '', weight: 'Medium Priority' },
            { title: 'Customization', score: '', weight: 'Medium Priority' },
            { title: 'Scalability', score: '', weight: 'Medium Priority' },
            { title: 'Integration with Other Tools', score: '', weight: 'Medium Priority' },
            { title: 'Configuration Adjustments', score: '', weight: 'Medium Priority' },
          ],
        },
        {
          id: 7,
          title: 'Compliance',
          weight: 'Medium Priority',
          subcriteria: [
            { title: 'Regulation', score: '', weight: 'Medium Priority' },
            { title: 'Internal Policies', score: '', weight: 'Medium Priority' },
            { title: 'Audit', score: '', weight: 'Medium Priority' },
            { title: 'Reports', score: '', weight: 'Medium Priority' },
            { title: 'Certification', score: '', weight: 'Medium Priority' },
          ],
        },
        {
          id: 8,
          title: 'Support and Documentation',
          weight: 'Medium Priority',
          subcriteria: [
            { title: 'Documentation Quality', score: '', weight: 'Medium Priority' },
            { title: 'Technical Support Availability', score: '', weight: 'Medium Priority' },
            { title: 'User Community', score: '', weight: 'Medium Priority' },
            { title: 'Learning Resources', score: '', weight: 'Medium Priority' },
            { title: 'Documentation Updates', score: '', weight: 'Medium Priority' },
          ],
        },
        {
          id: 9,
          title: 'Scalability',
          weight: 'Medium Priority',
          subcriteria: [
            { title: 'Growth Capacity', score: '', weight: 'Medium Priority' },
            { title: 'Large-Scale Performance', score: '', weight: 'Medium Priority' },
            { title: 'Expansion Flexibility', score: '', weight: 'Medium Priority' },
            { title: 'Growth Management', score: '', weight: 'Medium Priority' },
            { title: 'Support for Multinationals', score: '', weight: 'Medium Priority' },
          ],
        },
        {
          id: 10,
          title: 'Community and Adoption',
          weight: 'Medium Priority',
          subcriteria: [
            { title: 'Popularity', score: '', weight: 'Medium Priority' },
            { title: 'Community Feedback', score: '', weight: 'Medium Priority' },
            { title: 'Real Usage Examples', score: '', weight: 'Medium Priority' },
            { title: 'Collaborations and Partnerships', score: '', weight: 'Medium Priority' },
            { title: 'Continuous Development', score: '', weight: 'Medium Priority' },
          ],
        },
        {
          id: 11,
          title: 'Integration with Other Tools',
          weight: 'Medium Priority',
          subcriteria: [
            { title: 'Compatibility', score: '', weight: 'Medium Priority' },
            { title: 'APIs and Connectors', score: '', weight: 'Medium Priority' },
            { title: 'Interoperability', score: '', weight: 'Medium Priority' },
            { title: 'Ease of Integration', score: '', weight: 'Medium Priority' },
            { title: 'Support for Open Standards', score: '', weight: 'Medium Priority' },
          ],
        },
        {
          id: 12,
          title: 'Innovation and Update',
          weight: 'Medium Priority',
          subcriteria: [
            { title: 'Update Frequency', score: '', weight: 'Medium Priority' },
            { title: 'Incorporation of New Technologies', score: '', weight: 'Medium Priority' },
            { title: 'Research and Development', score: '', weight: 'Medium Priority' },
            { title: 'Market Feedback', score: '', weight: 'Medium Priority' },
            { title: 'Continuous Improvements', score: '', weight: 'Medium Priority' },
          ],
        },
      ],
    }))
  );

  
  // Função para alterar a pontuação de cada subcritério
  const handleScoreChange = (frameworkIndex, criteriaId, subIndex, score) => {
    setFrameworks((prevFrameworks) =>
      prevFrameworks.map((framework, idx) =>
        idx === frameworkIndex
          ? {
              ...framework,
              criteria: framework.criteria.map((criteria) =>
                criteria.id === criteriaId
                  ? {
                      ...criteria,
                      subcriteria: criteria.subcriteria.map((sub, i) =>
                        i === subIndex ? { ...sub, score } : sub
                      ),
                    }
                  : criteria
              ),
            }
          : framework
      )
    );
  };

  // Função para alterar o peso de cada subcritério
  const handleWeightChange = (frameworkIndex, criteriaId, subIndex, weight) => {
    setFrameworks((prevFrameworks) =>
      prevFrameworks.map((framework, idx) =>
        idx === frameworkIndex
          ? {
              ...framework,
              criteria: framework.criteria.map((criteria) =>
                criteria.id === criteriaId
                  ? {
                      ...criteria,
                      subcriteria: criteria.subcriteria.map((sub, i) =>
                        i === subIndex ? { ...sub, weight } : sub
                      ),
                    }
                  : criteria
              ),
            }
          : framework
      )
    );
  };

  // Função para alterar o peso de cada critério
  const handleCriteriaWeightChange = (frameworkIndex, criteriaId, weight) => {
    setFrameworks((prevFrameworks) =>
      prevFrameworks.map((framework, idx) =>
        idx === frameworkIndex
          ? {
              ...framework,
              criteria: framework.criteria.map((criteria) =>
                criteria.id === criteriaId ? { ...criteria, weight } : criteria
              ),
            }
          : framework
      )
    );
  };

  // Validações antes do envio das avaliações
  const validateForm = () => {
    for (const framework of frameworksData) {
      for (const criteria of framework.criteria) {
        if (!criteria.weight) {
          alert(`Please select the weight for the criterion: ${criteria.title}`);
          return false;
        }
        for (const sub of criteria.subcriteria) {
          if (!sub.score || !sub.weight) {
            alert(`Please fill in all fields for ${framework.frameworkName}.`);
            return false;
          }
        }
      }
    }
    return true;
  };

// Envia os dados para o banco de dados usando Supabase
const submitToDatabase = async () => {
  if (!user || !user.id) {
    alert('User data is missing. Please log in again.');
    return false;
  }

  try {
    // 1. Inserir a avaliação geral na tabela 'avaliacoes'
    const { data: avaliacaoData, error: avaliacaoError } = await supabase
      .from('avaliacoes')
      .insert({
        usuario_id: user.id,
        nome_framework: frameworksData.map((f) => f.frameworkName).join(', '), // Lista de nomes dos frameworks
        data_avaliacao: new Date(),
        dados: JSON.stringify(frameworksData), // Salva frameworksData como JSON
      })
      .select('id')
      .single();

    if (avaliacaoError) throw avaliacaoError;

    const avaliacaoId = avaliacaoData.id; // Captura o ID da avaliação inserida

    // 2. Inserir os critérios na tabela 'criterios'
    for (const framework of frameworksData) {
      for (const criterio of framework.criteria) {
        const { data: criterioData, error: criterioError } = await supabase
          .from('criterios')
          .insert({
            avaliacao_id: avaliacaoId,
            titulo: criterio.title,
            peso: criterio.weight,
            nota_final:
              criterio.subcriteria.reduce(
                (sum, sub) => sum + parseFloat(sub.score || 0),
                0
              ) / criterio.subcriteria.length,
          })
          .select('id')
          .single();

        if (criterioError) throw criterioError;

        const criterioId = criterioData.id;

        // 3. Inserir os subcritérios na tabela 'subcriterios'
        for (const sub of criterio.subcriteria) {
          const { error: subcriterioError } = await supabase
            .from('subcriterios')
            .insert({
              criterio_id: criterioId,
              titulo: sub.title,
              nota: parseFloat(sub.score || 0),
              peso: sub.weight,
            });

          if (subcriterioError) throw subcriterioError;
        }
      }
    }

    alert('Evaluation saved successfully!');
    return true;
  } catch (err) {
    console.error('Error saving evaluation:', err.message);
    alert(`Failed to save evaluation: ${err.message}`);
    return false;
  }
};

  
  

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      const success = await submitToDatabase();
  
      if (success) {
        navigate('/relatorio', { state: { frameworksData } });
      }
    }
  };
  

  // Verifica se a lista de frameworks está vazia
  if (!frameworks.length) {
    return <div>No frameworks selected for evaluation.</div>;
  }

  return (
    <div className="avaliacao-container">
      <h2>Framework Evaluation</h2>
      <form onSubmit={handleSubmit}>
        {frameworksData.map((framework, frameworkIndex) => (
          <div key={frameworkIndex} className="framework-container">
            <h3>Evaluation for {framework.frameworkName}</h3>

            {framework.criteria.map((criteria) => (
              <div key={criteria.id} className="criteria-container">
                <h4>{criteria.title}</h4>
                <div className="criteria-weight">
                  <label>
                    Criterion Weight:
                    <select
                      value={criteria.weight}
                      onChange={(e) =>
                        handleCriteriaWeightChange(frameworkIndex, criteria.id, e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      <option value="Low Priority">Low Priority</option>
                      <option value="Medium Priority">Medium Priority</option>
                      <option value="High Priority">High Priority</option>
                    </select>
                  </label>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Subcriteria</th>
                      <th>1 - Not Important</th>
                      <th>2 - Moderately Important</th>
                      <th>3 - Important</th>
                      <th>4 - Very Important</th>
                      <th>5 - Extremely Important</th>
                      <th>Subcriterion Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criteria.subcriteria.map((sub, subIndex) => (
                      <tr key={subIndex}>
                        <td>{sub.title}</td>
                        {[1, 2, 3, 4, 5].map((value) => (
                          <td key={value}>
                            <input
                              type="radio"
                              name={`framework-${frameworkIndex}-criteria-${criteria.id}-sub-${subIndex}`}
                              value={value}
                              checked={sub.score === value.toString()}
                              onChange={(e) =>
                                handleScoreChange(frameworkIndex, criteria.id, subIndex, e.target.value)
                              }
                            />
                          </td>
                        ))}
                        <td>
                          <select
                            value={sub.weight}
                            onChange={(e) => handleWeightChange(frameworkIndex, criteria.id, subIndex, e.target.value)}
                          >
                            <option value="">Select...</option>
                            <option value="Low Priority">Low Priority</option>
                            <option value="Medium Priority">Medium Priority</option>
                            <option value="High Priority">High Priority</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))}
        <button type="submit">Submit Evaluations</button>
      </form>
    </div>
  );
};

export default Avaliacao;
