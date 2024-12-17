import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { useLocation, useNavigate } from 'react-router-dom'; // Verifique se está correto
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../css/Relatorio.css';



ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Relatorio = () => {
  const navigate = useNavigate(); // Adicione essa linha
  const location = useLocation();

  const goToHome = () => {
    navigate('/home'); // Use navigate para ir para a página inicial
  };
  

  // Adicione uma verificação segura para frameworksData
  const frameworksData = location.state?.frameworksData || [];
  if (frameworksData.length === 0) {
    return <div>No data available for the report.</div>;
  }

  // Calcula a nota média ponderada de um critério
  const calculateCriteriaScore = (criteria) => {
    let totalScore = 0;
    let totalWeight = 0;

    criteria.subcriteria.forEach((sub) => {
      const weightValue =
        sub.weight === 'High Priority' ? 3 : sub.weight === 'Medium Priority' ? 2 : 1;
      totalScore += parseInt(sub.score, 10) * weightValue;
      totalWeight += weightValue;
    });

    return totalWeight ? (totalScore / totalWeight).toFixed(2) : '0.00';
  };

  // Calcula a nota final de um framework
  const calculateFinalScore = (framework) => {
    let totalScore = 0;
    let totalWeight = 0;

    framework.criteria.forEach((criteria) => {
      const weightValue =
        criteria.weight === 'High Priority' ? 3 : criteria.weight === 'Medium Priority' ? 2 : 1;
      const criteriaScore = parseFloat(calculateCriteriaScore(criteria));
      totalScore += criteriaScore * weightValue;
      totalWeight += weightValue;
    });

    return totalWeight ? (totalScore / totalWeight).toFixed(2) : '0.00';
  };

  const exportXLSX = () => {
    const worksheetData = [['Framework', 'Criterion', 'Subcriterion', 'Score', 'Weight']];
    frameworksData.forEach((framework) => {
      framework.criteria.forEach((criteria) => {
        criteria.subcriteria.forEach((sub) => {
          worksheetData.push([
            framework.frameworkName,
            criteria.title,
            sub.title,
            sub.score,
            sub.weight,
          ]);
        });
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, 'report.xlsx');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Evaluation Report', 14, 16);

    frameworksData.forEach((framework) => {
      doc.text(`Framework: ${framework.frameworkName}`, 14, doc.lastAutoTable?.finalY + 10 || 22);

      framework.criteria.forEach((criteria) => {
        const tableData = criteria.subcriteria.map((sub) => [
          sub.title,
          sub.score,
          sub.weight,
        ]);

        autoTable(doc, {
          startY: doc.lastAutoTable?.finalY + 10 || 30,
          head: [[`${criteria.title} | Score: ${calculateCriteriaScore(criteria)} | Weight: ${criteria.weight}`]],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [0, 123, 255] },
        });
      });

      const finalData = framework.criteria.map((criteria) => [
        criteria.title,
        calculateCriteriaScore(criteria),
        criteria.weight,
      ]);
      finalData.push(['Final Score', calculateFinalScore(framework), '']);

      autoTable(doc, {
        startY: doc.lastAutoTable?.finalY + 10,
        head: [['Criterion', 'Score', 'Weight']],
        body: finalData,
        theme: 'grid',
        headStyles: { fillColor: [0, 123, 255] },
      });
    });

    doc.save('report.pdf');
  };

  const renderSubcriteriaTables = () => {
    return frameworksData.map((framework, index) => (
      <div key={index}>
        <h3>{framework.frameworkName}</h3>
        {framework.criteria.map((criteria, i) => (
          <table key={i} className="relatorio-table">
            <thead>
              <tr>
                <th colSpan="3">
                  {criteria.title} | Score: {calculateCriteriaScore(criteria)} | Weight: {criteria.weight}
                </th>
              </tr>
              <tr>
                <th>Subcriterion</th>
                <th>Score</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {criteria.subcriteria.map((sub, idx) => (
                <tr key={idx}>
                  <td>{sub.title}</td>
                  <td>{sub.score}</td>
                  <td>{sub.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    ));
  };

  return (
    <div className="relatorio-container">
      <h2>Evaluation Report</h2>

      <div className="chart-container">
        <Bar
          data={{
            labels: frameworksData[0].criteria.map((c) => c.title),
            datasets: frameworksData.map((framework) => ({
              label: framework.frameworkName,
              data: framework.criteria.map((c) => calculateCriteriaScore(c)),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            })),
          }}
          options={{ responsive: true, scales: { y: { beginAtZero: true } } }}
        />
      </div>

      {renderSubcriteriaTables()}

      <div className="final-summary">
        <h3>Summary of Criteria Scores</h3>
        <table className="relatorio-table">
          <thead>
            <tr>
              <th>Criterion</th>
              <th>Score</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {frameworksData[0].criteria.map((criteria, i) => (
              <tr key={i}>
                <td>{criteria.title}</td>
                <td>{calculateCriteriaScore(criteria)}</td>
                <td>{criteria.weight}</td>
              </tr>
            ))}
            <tr>
              <th>Final Score</th>
              <th>{calculateFinalScore(frameworksData[0])}</th>
              <th></th>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="export-buttons">
        <button onClick={exportXLSX}>Export to XLSX</button>
        <button onClick={exportPDF}>Export to PDF</button>
        <button onClick={goToHome}>Home</button>
      </div>
    </div>
  );
};

export default Relatorio;
