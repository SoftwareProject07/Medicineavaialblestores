import React from 'react';
import './Popup.css';

const Popup = ({ message, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <div className="popup-icon">✔️</div>
        <div className="popup-message">{message}</div>
        <button className="popup-button" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default Popup;
