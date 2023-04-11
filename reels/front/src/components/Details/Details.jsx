import axios from "axios";
import YouTube from "react-youtube";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import style from "./Details.css";
import Loader from "../Loader/Loader";

const Details = ({loading,setLoading, apiKey, imgPath }) => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState({});
  const [movieGenres, setMovieGenres] = useState([]);
  const [movieVideos, setMovieVideos] = useState([]);
  const [movieTrailer, setMovieTrailer] = useState([]);
  const [trailerId, setTrailerId] = useState("");
  const [cast, setCast] = useState([]);
  

  const getMovieDetails = async () => {
    const details = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
    );
    console.log(details.data);
    setMovieDetails(details.data);
    setMovieGenres(details.data.genres);

    const videos = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`
    );
    setMovieVideos(videos.data.results);
     setLoading(false);
    movieVideos.map((video) => {
      if (video.name === "Official Trailer") {
        setMovieTrailer(video?.name);
        setTrailerId(video?.key);
      }
    });
  };

  const getMovieCredits = async () => {
    const result = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
    );
    console.log(result.data.cast);
    setCast(result.data.cast.slice(0, 5));
    console.log(cast);
     setLoading(false);
  };

  const opts = {
    height: "500",
    width: "100%",
    playerVars: {
      origin: window.location.origin,
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  function _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
  
  // const addToFav = async()=>{
  //   const result = await axios.post(`https://api.themoviedb.org/3/account/${sessionId}/favorite?api_key=${apiKey}`,{ 'media_type': "movie",'media_id': {id},'favorite': true})
  // console.log(result);
  // }

  useEffect(() => {
    setLoading(true);
    getMovieDetails();
    getMovieCredits();
  }, []);

  return (
    <>
    {loading?(<Loader/>):(<div className="container py-5">
      <div className="row py-4">
        <div className="col-md-5 d-flex justify-content-end">
          <img
            src={imgPath + movieDetails.poster_path}
            className="rounded-4 "
            alt=""
            width={'90%'}
          />
        </div>
        <div className="col-md-7">
          <div className="row justify-content-between">
          <h2 className={`fw-bold ${style.title}`}>{movieDetails.title}</h2>
          {/* <p className={`${style.heart} pe-5`} onClick={addToFav}><i className={`fa-solid fa-heart fs-2`}></i></p> */}
          </div>
          <div className="row w-75">
            {movieGenres.map((genre) => (
              <div className="col-md-6 col-lg" key={genre.id}>
                <div
                  className={`${style.genre}p-1 border rounded-5 text-center m-1`}
                >
                  {genre.name}
                </div>
              </div>
            ))}
          </div>
          <div className="fw-bold fs-5 py-2">
            <i className="fa-solid fa-star text-warning"></i>{" "}
            {movieDetails.vote_average}
          </div>
          <p className="py-4">{movieDetails.overview}</p>
          <p className={`${style.releaseDate}`}>
            <i className="fa-regular fa-calendar-days text-danger"></i> Release
            Date: {movieDetails.release_date}
          </p>
          <div className="cast py-1 ">
            <h3 className="text-capitalize py-2 mb-3 fs-2 fw-bold ms-4">cast</h3>
            <div className="row">
              {cast.map((person) => {
                return (
                  <div
                    className={`${style.person} text-center`}
                    key={person.id}
                  >
                    {person.profile_path ? (
                      <>
                        <img
                          src={imgPath + person.profile_path}
                          className="rounded-5 pb-2"
                          alt=""
                          width={"80px"}
                        />
                      </>
                    ) : (
                      <>
                        <img
                          src={"/assets/avatar.jpg"}
                          className="rounded-5 pb-2"
                          alt=""
                          width={"80px"}
                          height={"150px"}
                        />
                      </>
                    )}
                    <p>{person.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-12 py-5">
          <h3 className="text-capitalize py-2 mb-5">Official Trailer</h3>

          <YouTube
            videoId={trailerId}
            loading="eager"
            opts={opts}
            onReady={_onReady}
          />
          {/* <iframe src={`//www.youtube.com/embed/${trailerId}`} loading='lazy' title='trailer' width='100%' height='500px' frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe> */}
        </div>
      </div>
    </div>)}
    </>
  );
};

export default Details;