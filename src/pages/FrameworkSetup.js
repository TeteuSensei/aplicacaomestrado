import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FrameworkSetup = ({ onFrameworksSubmit }) => {
  const [frameworks, setFrameworks] = useState([]);
  const [frameworkCount, setFrameworkCount] = useState(1);
  const navigate = useNavigate();

  const handleStart = () => {
    if (frameworks.length > 0 && frameworks.every((f) => f.trim() !== '')) {
      onFrameworksSubmit(frameworks); // Atualiza o estado global (se necessário)
      navigate('/avaliacao', { state: { frameworks } }); // Passa frameworks via state
    } else {
      alert('Please add at least one framework name.');
    }
  };
  

  return (
    <div>
      <h2>Configure Frameworks</h2>
      <label>
        Number of frameworks to evaluate:
        <input
          type="number"
          value={frameworkCount}
          onChange={(e) => setFrameworkCount(e.target.value)}
          min="1"
        />
      </label>
      {[...Array(parseInt(frameworkCount, 10))].map((_, index) => (
        <div key={index}>
          <label>Framework {index + 1}:</label>
          <input
            type="text"
            onChange={(e) => {
              const newFrameworks = [...frameworks];
              newFrameworks[index] = e.target.value;
              setFrameworks(newFrameworks);
            }}
          />
        </div>
      ))}
      <button onClick={handleStart}>Start Evaluation</button>
    </div>
  );
};

export default FrameworkSetup;
