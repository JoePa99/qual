import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import Settings from './Settings';

const Header = () => {
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <>
      <header className="header">
        <div className="logo">
          <Link to="/">Segmentation & Synthetic Qual App</Link>
        </div>
        <nav className="nav">
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/data-upload">Data Upload</Link>
            </li>
            <li>
              <Link to="/segmentation">Segmentation</Link>
            </li>
            <li>
              <Link to="/synthetic-qual">Synthetic Qual</Link>
            </li>
            <li>
              <Link to="/focus-groups">Focus Groups</Link>
            </li>
          </ul>
        </nav>
        <button 
          className="settings-button" 
          onClick={() => setShowSettings(true)}
          title="AI Settings"
        >
          ⚙️
        </button>
      </header>
      
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </>
  );
};

export default Header;