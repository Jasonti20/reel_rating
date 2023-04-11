import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Row from "./Row";
import requests from "../../config/tmdb";
import { getMoviesForUser } from "../../config/tmdb";
import Banner from "./Banner";

const DashBoard = () => {
  const { getCurrentUserId } = useAuth();

  // Access currentUserId
  const userId = getCurrentUserId();

  const moviesPromise = getMoviesForUser(userId);
  // moviesPromise.then(movies => console.log("test", movies)); 

  return (
    <div>
      <Banner />
      <Row title="Popular Now" fetchUrl={requests.fetchPopular} moviesPromise={null} isLargeRow />
      
      <Row title="Recommended"fetchUrl={null} moviesPromise={moviesPromise} isLargeRow />

      {/* <Row title='Top Rated' fetchUrl={requests.fetchTopRated} />
      <Row title='Action Movies' fetchUrl={requests.fetchActionMovies} />
      <Row title='Comedy Movies' fetchUrl={requests.fetchComedyMovies} />
      <Row title='Horror Movies' fetchUrl={requests.fetchHorrorMovies} />
      <Row title='Romance Movies' fetchUrl={requests.fetchRomanceMovies} />
      <Row title='Documentaries' fetchUrl={requests.fetchDocumentaries} /> */}
    </div>
  );
};

export default DashBoard;
