import React, { useState, useEffect, useRef } from 'react';
import axios from '../../config/axios';
import './Row.css';
import YouTube from 'react-youtube';
import { Modal } from "react-bootstrap";


const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const baseImgUrl = 'https://image.tmdb.org/t/p/original';

function Row({ title, fetchUrl, isLargeRow, moviesPromise }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState('');
  const playerRef = useRef(null);
  const [movieTitle, setMovieTitle] = useState("");
  const [movieUrl, setMovieUrl] = useState('');


  useEffect(() => {
    async function fetchData() {
      try {
        const request =  await axios.get(fetchUrl);
  
        if (request.data?.results?.length) {
          setMovies(request.data.results);
        }
  
        return request;
      } catch (error) {
        console.error(error);
      }
    }

    if (moviesPromise) {
      moviesPromise.then((movieData) => {
        setMovies(movieData);
      }).catch((error) => {
        console.error(error);
      });
    } else {
      fetchData();
    }
  
    return () => {
      if (playerRef.current) {
        playerRef.current.internalPlayer.destroy();
      }
    };
  }, [fetchUrl, moviesPromise]);
  

  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  const modalElement = document.getElementById('exampleModalCenter');
    const modalHideHandler = () => {
      if (playerRef.current) {
        playerRef.current.internalPlayer.pauseVideo();
        playerRef.current.internalPlayer.stopVideo();
      }
      setTrailerUrl('');
    };

  const handleClick = async (movie) => {
    if (trailerUrl) {
      setTrailerUrl('');
    } else {
      let videosResponse = await axios.get(
        `/movie/${movie.id}/videos?api_key=` + API_KEY 
      );
      let videos = videosResponse.data.results;
      let trailers = videos.filter(video => video.type === 'Trailer');
      if (trailers.length > 0) {
        setTrailerUrl(trailers[0].key);
      } else {
        setTrailerUrl(null);
      }

      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=`+API_KEY
      );
      const cur = response.data.title;
      setMovieTitle(cur);
      console.log("Name" + cur);
      //setTrailerUrl(trailerurl.data.results[0]?.key);
    }
    setMovieUrl("http://localhost:3000/movie/" + movie.id )
    modalElement.addEventListener('hidden.bs.modal', modalHideHandler);
  };

  const handleClose = () => {
    modalElement.removeEventListener('hidden.bs.modal', modalHideHandler);
    setTrailerUrl('');
  };




  return (
    <div className='row'>
      <h2>{title}</h2>
      <div className='row__posters'>
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && 'row__posterLarge'}`}
            src={`${baseImgUrl}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
            data-toggle="modal" 
            data-target="#exampleModalCenter"
          />
        ))}
      </div>
    
      <div className="modal fade" id="exampleModalCenter" data-backdrop="static" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
          <div className="modal-header">
          <Modal.Title>{movieTitle}</Modal.Title>
          <button type="button" class="close" data-dismiss="modal" onClick={handleClose} alt='Close button'>&times;</button>
          </div>
            <div className="modal-body">
              {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} ref={playerRef} />}
            </div>
            <div className="modal-footer">
              <a href={movieUrl} target="_self" class="btn btn-primary" alt='More info'>More Info</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Row;

