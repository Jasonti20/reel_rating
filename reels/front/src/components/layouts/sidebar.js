import React from "react";
import { useState, useEffect } from "react";
import "./sidebar.css";
import Logout from "../accounts/Logout";
import { LogoutIcon } from "@heroicons/react/outline";

function SideNav(props) {
  const { showNav, onClose } = props;
  const [modal, setModal] = useState(false);
  // const { user, logout } = AuthContext();

  return (
    <>
      <div className={`sidenav ${showNav ? "open" : ""}`}>
        <button
          className="btn"
          onClick={() => {
            onClose();
            window.location.href = "/profile";
          }}
        >
          Profile
        </button>
        <button
          className="btn"
          onClick={() => {
            onClose();
            window.location.href = "/questionnaire";
          }}
        >
          Questionnaire
        </button>
        <button className="logout-btn" onClick={() => setModal(true)}>
          <LogoutIcon className="h-8 w-8" aria-hidden="true" />
        </button>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
      {modal && <Logout modal={modal} setModal={setModal} />}
    </>
  );
}

export default SideNav;
