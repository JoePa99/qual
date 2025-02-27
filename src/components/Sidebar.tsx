import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? 'active' : ''}
                end
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/data-upload" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Data Upload
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/segmentation" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Segmentation
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/synthetic-qual" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Synthetic Qual
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/focus-groups" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Focus Groups
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;