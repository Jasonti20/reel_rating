import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import Logout from "../accounts/Logout";
import './Nav.css';
import SideNav from './sidebar';

export default function Header() {
  const [modal, setModal] = useState(false);

  const { currentUser } = useAuth();

  const [show, handleShow] = useState(false);
  const [showNav, setShowNav] = useState(false);


  const handleClick = () => {
    setShowNav(true);
  };

  const handleClose = () => {
    setShowNav(false);
  };

  // const scrollToTop = () => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth"
  //   });
  // };

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
    <>
      <nav className="px- px-2 sm:px-4 py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-900 text-sm rounded border dark:text-white">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <Link to="/dashboard" className="flex">
            <span className="self-center text-lg font-semibold whitespace-nowrap text-gray-900 dark:text-white">
              Reel Ratings
            </span>
          </Link>
          <div className="flex md:order-2">
            {currentUser ? (
              <>
               
                <img
                    className="h-8 w-8 rounded-full"
                    src={currentUser.photoURL}
                    alt="Avatar"
                    onClick={handleClick}
                  />
                  <SideNav showNav={showNav} onClose={handleClose} />
                {/* <Link
                  to="/profile"
                  className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-full text-sm p-2.5"
                >

                </Link> */}
                
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      {modal && <Logout modal={modal} setModal={setModal} />}
    </>
  );
}
