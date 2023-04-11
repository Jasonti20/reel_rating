import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const requests = {
  fetchPopular: `/movie/popular?api_key=${API_KEY}&language=en-US&page=1%27`,
  fetchLatest: `/movie/latest?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
  fetchRecommended: `/movie/505642/similar?api_key=${API_KEY}&language=en-US`,
};

export async function fetchMoviesById(ids) {
  const movies = [];
  for (const id of ids) {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;
    const response = await fetch(url);
    const data = await response.json();
    movies.push(data);
  }
  return movies;
}

export async function getMoviesForUser(userId) {
  const userDocRef = doc(db, "preferredMovie", userId);
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    return null;
  }
  const movieIds = userDoc.data().returndata;
  const movies = await fetchMoviesById(movieIds);
  const formattedMovies = [];
  for (let i = 0; i < movies.length; i++) {
    formattedMovies[i] = movies[i];
  }
  return formattedMovies;
}

export default requests;
