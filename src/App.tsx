import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DataUpload from './components/DataUpload';
import Segmentation from './components/Segmentation';
import SyntheticQual from './components/SyntheticQual';
import FocusGroups from './components/FocusGroups';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/data-upload" element={<DataUpload />} />
            <Route path="/segmentation" element={<Segmentation />} />
            <Route path="/synthetic-qual" element={<SyntheticQual />} />
            <Route path="/focus-groups" element={<FocusGroups />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;