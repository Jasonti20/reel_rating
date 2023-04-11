import React, { useState, useEffect } from 'react';
import './Nav.css';
import SideNav from './sidebar';
import { LogoutIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import Logout from "../accounts/Logout";

function Nav() {
  const [show, handleShow] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [modal, setModal] = useState(false);

  const { currentUser } = useAuth();

  const handleClick = () => {
    setShowNav(true);
  };

  const handleClose = () => {
    setShowNav(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        handleShow(true);
      } else handleShow(false);
    });
    return () => {
      window.removeEventListener('scroll', null);
    };
  }, []);

  return (
    <div className={`nav ${show && 'nav__black'}`}>

      <img
        className='nav__avatar'
        src='https://i.pinimg.com/originals/0d/dc/ca/0ddccae723d85a703b798a5e682c23c1.png'
        alt='Avatar'
        onClick={handleClick}
      />
                    <>
                <button><Link to="./questionnaire">Questionnaire</Link></button>
                <button
                  className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5"
                  onClick={() => setModal(true)}
                >
                  <LogoutIcon className="h-8 w-8" aria-hidden="true" />
                </button>
                <Link
                  to="/profile"
                  className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-full text-sm p-2.5"
                >
                  <img
                    className="h-8 w-8 rounded-full"
                    src={currentUser.photoURL}
                    alt=""
                  />
                </Link>
              </>
      <SideNav showNav={showNav} onClose={handleClose} />
    </div>
  );
}

export default Nav;
