import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./components/accounts/Register";
import Login from "./components/accounts/Login";
import { AuthProvider } from "./contexts/AuthContext";
import Profile from "./components/accounts/Profile";
import WithPrivateRoute from "./utils/WithPrivateRoute";
import Header from "./components/layouts/Header";
import ErrorMessage from "./components/layouts/ErrorMessage";
import DefaultMain from "./components/layouts/Main";
import DashBoard from "./components/layouts/dashboard"
import Questionnaire from "./components/layouts/questionnaire"
import Details from "./components/Details/Details.jsx";
import { useState } from "react";


function App() {
  
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const imgPath = "https://image.tmdb.org/t/p/original/";
  const [loading, setLoading] = useState(true);

  return (
    <AuthProvider>
      <Router>
        <Header />
        <ErrorMessage />
        <Routes>
          <Route exact path="" element={<DefaultMain />} />
          <Route
            path="/movie/:id"
            element={<Details loading={loading} setLoading={setLoading} apiKey={API_KEY} imgPath={imgPath} />}
          ></Route>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route
            exact
            path="/profile"
            element={
              <WithPrivateRoute>
                <Profile />
              </WithPrivateRoute>
            }
          />
        
        <Route
            exact
            path="/dashboard"
            element={
              <WithPrivateRoute>
                <DashBoard />
              </WithPrivateRoute>
            }
          />
                  <Route
            exact
            path="/questionnaire"
            element={
              <WithPrivateRoute>
                <Questionnaire />
              </WithPrivateRoute>
            }
          />
          </Routes>
      </Router>
    </AuthProvider>
    
  );
}

export default App;
