import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>AI-Powered Customer Insights</h1>
      
      <div className="welcome-banner">
        <div className="welcome-content">
          <h2>Transform Qualitative Research with AI</h2>
          <p>Generate deep customer insights without extensive quantitative data</p>
          <Link to="/data-upload" className="btn-primary get-started-btn">Get Started</Link>
        </div>
      </div>
      
      <div className="dashboard-summary">
        <div className="summary-card">
          <div className="card-icon">📋</div>
          <h3>Research Input</h3>
          <p>Enter your qualitative research findings and context</p>
          <Link to="/data-upload" className="btn-primary">Enter Research</Link>
        </div>
        <div className="summary-card">
          <div className="card-icon">🧩</div>
          <h3>AI Segmentation</h3>
          <p>Let AI identify and describe distinct customer segments</p>
          <Link to="/segmentation" className="btn-primary">Create Segments</Link>
        </div>
        <div className="summary-card">
          <div className="card-icon">🎯</div>
          <h3>Synthetic Qual</h3>
          <p>Generate detailed qualitative insights for each segment</p>
          <Link to="/synthetic-qual" className="btn-primary">Create Qual Boards</Link>
        </div>
        <div className="summary-card">
          <div className="card-icon">👥</div>
          <h3>Focus Groups</h3>
          <p>Run simulated focus groups with AI-generated personas</p>
          <Link to="/focus-groups" className="btn-primary">Set Up Focus Groups</Link>
        </div>
      </div>
      
      <div className="getting-started">
        <h2>How It Works</h2>
        <ol>
          <li>
            <h3>Enter Your Research</h3>
            <p>Share your qualitative findings, research context, and business goals. No need for extensive quantitative data sets.</p>
          </li>
          <li>
            <h3>AI Generates Segments</h3>
            <p>Our AI analyzes your input to identify meaningful customer segments with detailed characteristics, preferences, and pain points.</p>
          </li>
          <li>
            <h3>Develop Synthetic Qual Boards</h3>
            <p>Create rich qualitative insights for each segment, including representative quotes and behavioral patterns.</p>
          </li>
          <li>
            <h3>Simulate Focus Groups</h3>
            <p>Test ideas and messages with AI-generated personas that authentically represent your customer segments.</p>
          </li>
        </ol>
      </div>
      
      <div className="use-cases">
        <h2>Common Use Cases</h2>
        <div className="use-case-grid">
          <div className="use-case-card">
            <h3>Product Development</h3>
            <p>Understand customer needs to guide feature prioritization and product roadmaps.</p>
          </div>
          <div className="use-case-card">
            <h3>Marketing Strategy</h3>
            <p>Develop targeted messaging and campaigns based on segment preferences.</p>
          </div>
          <div className="use-case-card">
            <h3>Customer Experience</h3>
            <p>Identify pain points and opportunities to enhance satisfaction across segments.</p>
          </div>
          <div className="use-case-card">
            <h3>Business Strategy</h3>
            <p>Make informed decisions with deeper understanding of your customer base.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;