import React from 'react';
import { AuthContext } from "../../contexts/AuthContext";
import './sidebar.css';

function SideNav(props) {
    const { showNav, onClose } = props;
    // const { user, logout } = AuthContext();
  
    return (
      <div className={`sidenav ${showNav ? 'open' : ''}`}>
        {/* <button className="logout" onClick={logout}>Log out</button> */}
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    );
  }

export default SideNav;