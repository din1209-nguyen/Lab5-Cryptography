import React from 'react';
import './MainMenu.css';

function MainMenu({ onSelectFeature }) {
  return (
    <div className="main-menu">
      <div className="menu-container">
        <h2>Select a Cryptography Feature</h2>
        <p className="menu-subtitle">Choose the operation you want to perform</p>

        <div className="menu-buttons">
          <button
            className="menu-button symmetric-button"
            onClick={() => onSelectFeature('symmetric')}
          >
            <div className="button-icon">🔒</div>
            <div className="button-title">Symmetric Encryption</div>
            <div className="button-desc">DES, 3DES, AES</div>
          </button>

          <button
            className="menu-button asymmetric-button"
            onClick={() => onSelectFeature('asymmetric')}
          >
            <div className="button-icon">🔑</div>
            <div className="button-title">Asymmetric Encryption</div>
            <div className="button-desc">RSA Key Generation & Operations</div>
          </button>

          <button
            className="menu-button hash-button"
            onClick={() => onSelectFeature('hash')}
          >
            <div className="button-icon">🎯</div>
            <div className="button-title">Hash Functions</div>
            <div className="button-desc">MD5, SHA-256</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;
