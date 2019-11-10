import React from 'react';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './style.css';

function Header() {
  return (
    <div className="header">
      <div className="logo">
        <span>Facebook.</span>
      </div>
      <div className="profile">
        <span>Meu perfil</span>
        <FontAwesomeIcon icon={ faUserCircle } />
      </div>
    </div>
  );
}

export default Header;