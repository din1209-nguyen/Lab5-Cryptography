import React, { useState } from 'react';
import './App.css';
import MainMenu from './components/MainMenu';
import SymmetricEncryption from './components/SymmetricEncryption';
import AsymmetricEncryption from './components/AsymmetricEncryption';
import HashFunctions from './components/HashFunctions';

function App() {
  const [currentPage, setCurrentPage] = useState('menu');

  const handleBackToMenu = () => {
    setCurrentPage('menu');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🔐 Cryptography Toolkit</h1>
      </header>

      <main className="app-main">
        {currentPage === 'menu' && (
          <MainMenu onSelectFeature={setCurrentPage} />
        )}
        {currentPage === 'symmetric' && (
          <SymmetricEncryption onBack={handleBackToMenu} />
        )}
        {currentPage === 'asymmetric' && (
          <AsymmetricEncryption onBack={handleBackToMenu} />
        )}
        {currentPage === 'hash' && (
          <HashFunctions onBack={handleBackToMenu} />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Cryptography Toolkit. Educational Purpose Only.</p>
      </footer>
    </div>
  );
}

export default App;
