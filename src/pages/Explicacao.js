import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Explicacao.css'; // Arquivo CSS para estilização

const Explicacao = () => {
  const navigate = useNavigate();
  <button onClick={() => navigate('/home')} className="back-btn">
  Back to Home
</button>


  return (
    <div className="explicacao-container">
      
      <div className="explicacao-content">
        <h1>How the System Works</h1>
        
        <section className="explicacao-section">
          <h2>1. Framework Selection</h2>
          <p>
            To start, the user must select the frameworks they want to evaluate. 
            At the beginning, you will be prompted to enter the number of frameworks and their respective names.
            Make sure the frameworks entered are correct for accurate evaluation.
          </p>
        </section>

        <section className="explicacao-section">
          <h2>2. Criteria and Subcriteria Evaluation</h2>
          <p>
            The system includes a total of 12 criteria, each with its specific subcriteria, which will be used to evaluate cyber risk management frameworks. Each framework is evaluated based on these criteria, taking into account the impact of each on its overall performance. The selected criteria for evaluation are:
          </p>

          <ul>
            <li><strong>Cost:</strong> Evaluates the costs associated with the implementation and maintenance of the framework. Subcriteria:
              <ul>
                <li>Implementation</li>
                <li>License</li>
                <li>Training</li>
                <li>Maintenance</li>
                <li>Consultancy</li>
              </ul>
            </li>
            <li><strong>Information Security:</strong> Measures the effectiveness of the framework in protecting critical information. Subcriteria:
              <ul>
                <li>Data Protection</li>
                <li>Intrusion Detection</li>
                <li>Incident Response</li>
                <li>Recovery</li>
                <li>Prevention</li>
              </ul>
            </li>
            <li><strong>Efficiency:</strong> Refers to the framework's ability to optimize security processes and resources. Subcriteria:
              <ul>
                <li>Resource Optimization</li>
                <li>Response Time</li>
                <li>Automation</li>
                <li>Scalability</li>
                <li>Integration</li>
              </ul>
            </li>
            <li><strong>Performance:</strong> Evaluates the performance of the framework in terms of incident response and risk mitigation. Subcriteria:
              <ul>
                <li>Effectiveness of Security Measures</li>
                <li>Threat Detection Rate</li>
                <li>Risk Mitigation</li>
                <li>Operational Impact</li>
                <li>Recovery Time</li>
              </ul>
            </li>
            <li><strong>Complexity:</strong> Analyzes the ease of implementation and use of the framework. Subcriteria:
              <ul>
                <li>Ease of Implementation</li>
                <li>Learning Curve</li>
                <li>Technical Requirements</li>
                <li>Compatibility with Existing Systems</li>
                <li>Maintenance Complexity</li>
              </ul>
            </li>
            <li><strong>Flexibility/Adaptability:</strong> Evaluates the framework's ability to adapt to different types of organizations and sectors. Subcriteria:
              <ul>
                <li>Adaptation to Different Sectors</li>
                <li>Customization</li>
                <li>Scalability</li>
                <li>Integration with Other Tools</li>
                <li>Configuration Adjustments</li>
              </ul>
            </li>
            <li><strong>Compliance:</strong> Checks the framework's alignment with security standards and regulations. Subcriteria:
              <ul>
                <li>Regulation</li>
                <li>Internal Policies</li>
                <li>Audit</li>
                <li>Reports</li>
                <li>Certification</li>
              </ul>
            </li>
            <li><strong>Support and Documentation:</strong> Examines the quality and availability of technical support and framework documentation. Subcriteria:
              <ul>
                <li>Documentation Quality</li>
                <li>Availability of Technical Support</li>
                <li>User Community</li>
                <li>Learning Resources</li>
                <li>Documentation Updates</li>
              </ul>
            </li>
            <li><strong>Scalability:</strong> Evaluates the framework's ability to grow with the organization. Subcriteria:
              <ul>
                <li>Growth Capacity</li>
                <li>Performance at Scale</li>
                <li>Expansion Flexibility</li>
                <li>Growth Management</li>
                <li>Multinational Support</li>
              </ul>
            </li>
            <li><strong>Community and Adoption:</strong> Considers the size and activity of the user and developer community. Subcriteria:
              <ul>
                <li>Popularity</li>
                <li>Community Feedback</li>
                <li>Real Use Cases</li>
                <li>Collaborations and Partnerships</li>
                <li>Continuous Development</li>
              </ul>
            </li>
            <li><strong>Integration with Other Tools:</strong> Evaluates the ease of integrating the framework with other tools and systems. Subcriteria:
              <ul>
                <li>Compatibility</li>
                <li>APIs and Connectors</li>
                <li>Interoperability</li>
                <li>Integration Ease</li>
                <li>Support for Open Standards</li>
              </ul>
            </li>
            <li><strong>Innovation and Updates:</strong> Analyzes the frequency of updates and the incorporation of new technologies and practices. Subcriteria:
              <ul>
                <li>Update Frequency</li>
                <li>Incorporation of New Technologies</li>
                <li>Research and Development</li>
                <li>Market Feedback</li>
                <li>Continuous Improvements</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="explicacao-section">
          <h2>3. How the Evaluation Calculation Works</h2>
          <p>
            The final score of a framework is calculated based on the evaluations of criteria and subcriteria, taking into account the weights assigned to each. The calculation methodology is designed to reflect the relative importance of each criterion and subcriterion in the context of cyber risk management.
          </p>

          <h3>Subcriteria Score Calculation</h3>
          <p>
            Each subcriterion within a criterion receives a score and a weight indicating its priority. The weight scale works as follows:
          </p>
          <ul>
            <li><strong>High Priority:</strong> Weight = 3</li>
            <li><strong>Medium Priority:</strong> Weight = 2</li>
            <li><strong>Low Priority:</strong> Weight = 1</li>
          </ul>
          <p>
            The weighted score of each subcriterion is calculated by multiplying the assigned score by its weight. For example, if a subcriterion "Data Protection" has a score of 5 and a weight of "High Priority", the weighted score will be:
          </p>
          <blockquote>Weighted Score = Score (5) x Weight (3) = 15</blockquote>

          <h3>Criteria Score Calculation</h3>
          <p>
            The score of each criterion is obtained by the weighted average of its subcriteria scores. If a criterion has several subcriteria, their scores are summed based on weight, and the average is calculated. For example, if the criterion "Cost" includes three subcriteria with the following weighted scores:
          </p>
          <ul>
            <li>License: Score = 4, Weight = 2 (Medium Priority)</li>
            <li>Maintenance: Score = 3, Weight = 3 (High Priority)</li>
            <li>Consultancy: Score = 2, Weight = 1 (Low Priority)</li>
          </ul>
          <p>
            The final score for the "Cost" criterion would be:
          </p>
          <blockquote>Final Criterion Score = (4 x 2 + 3 x 3 + 2 x 1) ÷ (2 + 3 + 1) = 3.33</blockquote>

          <h3>Final Framework Score Calculation</h3>
          <p>
            The final score of a framework is obtained by the weighted average of the criteria scores. Just like the subcriteria, each criterion has a weight that reflects its overall importance in the framework evaluation. These weights are adjustable, but by default, all criteria have the same weight.
          </p>
          <blockquote>Final Score = (Criterion 1 Score x Weight 1 + Criterion 2 Score x Weight 2 + ...) ÷ (Sum of Weights)</blockquote>

          <h3>Result Interpretation</h3>
          <p>
            The final scores are used to compare frameworks in terms of suitability for a particular organization or cyber risk management scenario. The higher the score, the better the framework meets the evaluated criteria and subcriteria. This weighted approach ensures that frameworks are fairly evaluated, considering the priorities set by the evaluator.
          </p>
        </section>

        <section className="explicacao-section">
          <h2>4. Comparing Results</h2>
          <p>
            After the evaluation, you can compare the results between different frameworks or between evaluations from different users. The comparison page allows clear visualization of the data through comparative charts and tables.
          </p>
        </section>

        <section className="explicacao-section">
          <h2>5. Report Generation</h2>
          <p>
            The results of your evaluations can be exported as detailed reports, making it easier for further analysis. These reports include performance charts, assigned scores, and the priority of each criterion.
          </p>
        </section>

        <section className="explicacao-section">
          <h2>Frequently Asked Questions (FAQ)</h2>
          <p>If you have any questions, refer to the FAQ section below:</p>
          <ul>
            <li><strong>How do I reset my password?</strong> Go to the profile and click on "Change Password".</li>
            <li><strong>How can I add new frameworks?</strong> Go to the framework selection section and enter the name of the new framework.</li>
            <li><strong>Where can I see the generated reports?</strong> You can access the "Reports" section in the menu.</li>
          </ul>
        </section>

        <footer className="explicacao-footer">
          <p>For more information, contact technical support.</p>
        </footer>
      </div>
    </div>
  );
};

export default Explicacao;

