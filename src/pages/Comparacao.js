import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase"; // Certifique-se de ter a configuração do supabase
import "../css/Comparacao.css"; // Estilo CSS

const FrameworkComparison = () => {
  const [frameworks, setFrameworks] = useState([]); // Para armazenar os frameworks do banco
  const [selectedFrameworks, setSelectedFrameworks] = useState([]); // Frameworks selecionados
  const [loading, setLoading] = useState(true); // Para controlar o estado de carregamento
  const [criterios, setCriterios] = useState([]); // Para armazenar os critérios
  const [subcriterios, setSubcriterios] = useState([]); // Para armazenar os subcritérios

  useEffect(() => {
    // Função para buscar os frameworks do banco de dados
    const fetchFrameworks = async () => {
      try {
        const { data, error } = await supabase
          .from("avaliacoes")
          .select("nome_framework, id");

        if (error) {
          throw error;
        }

        setFrameworks(data); // Atualiza o estado com os frameworks encontrados no banco
        setLoading(false); // Finaliza o carregamento
      } catch (err) {
        console.error("Error fetching frameworks:", err);
      }
    };

    // Função para buscar os critérios e subcritérios do banco de dados
    const fetchCriteriosAndSubcriterios = async () => {
      try {
        const { data: criteriosData, error: criteriosError } = await supabase
          .from("criterios")
          .select("*");

        if (criteriosError) throw criteriosError;

        const { data: subcriteriosData, error: subcriteriosError } = await supabase
          .from("subcriterios")
          .select("*");

        if (subcriteriosError) throw subcriteriosError;

        setCriterios(criteriosData); // Armazena os critérios no estado
        setSubcriterios(subcriteriosData); // Armazena os subcritérios no estado
      } catch (err) {
        console.error("Error fetching criterios and subcriterios:", err);
      }
    };

    fetchFrameworks(); // Chama a função de buscar frameworks
    fetchCriteriosAndSubcriterios(); // Chama a função para buscar critérios e subcritérios
  }, []); // O efeito só será executado uma vez

  const handleSelectFramework = (e) => {
    const value = e.target.value;
    if (!selectedFrameworks.includes(value)) {
      setSelectedFrameworks((prev) => [...prev, value]);
    }
  };

  const handleRemoveFramework = (framework) => {
    setSelectedFrameworks((prev) =>
      prev.filter((item) => item !== framework)
    );
  };

  const getComparisonData = () =>
    selectedFrameworks.map((fw) =>
      frameworks.find((framework) => framework.nome_framework === fw)
    );

  // Função para calcular a nota do framework com base nos critérios e subcritérios
  // Função para calcular a pontuação de cada subcritério
  const calculateSubcriteriaScore = (frameworkName, subcriterion) => {
    let totalScore = 0;
    let totalWeight = 0;

    // Filtra os subcritérios que pertencem ao critério atual
    const relevantSubcriterios = subcriterios.filter(
      (sub) => sub.criterio_id === subcriterion.criterio_id
    );

    let subScore = 0;
    let subWeight = 0;

    // Calcula a pontuação ponderada dos subcritérios
    relevantSubcriterios.forEach((sub) => {
      // O peso do subcritério é baseado no campo "peso" que pode ser 'High', 'Medium' ou 'Low'
      const weight = sub.peso === "High Priority" ? 3 : sub.peso === "Medium Priority" ? 2 : 1;
      
      // Aqui você pega a nota do subcritério para o framework atual
      const subNote = parseFloat(sub.nota);
      if (!isNaN(subNote)) {
        subScore += subNote * weight;
        subWeight += weight;
      }
    });

  // Retorna a pontuação ponderada média do subcritério
  return subWeight ? (subScore / subWeight).toFixed(2) : "0.00";
};


return (
  <div className="comparison-container">
    <h1>Compare Frameworks</h1>
    <div className="framework-selector">
      <label>Select Frameworks: </label>
      <select onChange={handleSelectFramework}>
        <option value="">Select</option>
        {frameworks.map((framework) => (
          <option key={framework.id} value={framework.nome_framework}>
            {framework.nome_framework}
          </option>
        ))}
      </select>
    </div>

    <div className="selected-frameworks">
      <h3>Selected Frameworks:</h3>
      <ul>
        {selectedFrameworks.map((fw) => (
          <li key={fw}>
            {fw}{" "}
            <button onClick={() => handleRemoveFramework(fw)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>

    {selectedFrameworks.length > 1 && (
      <div className="comparison-tables">
        {criterios.map((criterio) => (
          <div key={criterio.id} className="comparison-table">
            <h3>{criterio.titulo}</h3>
            <table>
              <thead>
                <tr>
                  <th>Subcriteria</th>
                  {selectedFrameworks.map((fw) => (
                    <th key={fw}>{fw}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subcriterios
                  .filter((sub) => sub.criterio_id === criterio.id)
                  .map((sub) => (
                    <tr key={sub.id}>
                      <td>{sub.titulo}</td>
                      {selectedFrameworks.map((fw) => (
                        <td key={fw}>
                          {calculateSubcriteriaScore(fw, sub)}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    )}
  </div>
);

};

export default FrameworkComparison;
