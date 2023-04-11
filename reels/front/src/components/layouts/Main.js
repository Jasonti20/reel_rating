import React from "react";
// import { useUserContext } from "./context/userContext";
import Row from './Row';
import requests from '../../config/tmdb';
import Banner from './Banner';
// import Nav from './Nav';

const DefaultMain = () => {
  // const { user, logoutUser } = useUserContext();
  return (
    <div>
      <Banner />
      <Row
        title='Popular Now' fetchUrl={requests.fetchPopular} 
        isLargeRow
      />
      {/* <Row title='Top Rated' fetchUrl={requests.fetchTopRated} />
      <Row title='Action Movies' fetchUrl={requests.fetchActionMovies} />
      <Row title='Comedy Movies' fetchUrl={requests.fetchComedyMovies} />
      <Row title='Horror Movies' fetchUrl={requests.fetchHorrorMovies} />
      <Row title='Romance Movies' fetchUrl={requests.fetchRomanceMovies} />
      <Row title='Documentaries' fetchUrl={requests.fetchDocumentaries} /> */}
    </div>
  );
};

export default DefaultMain;
