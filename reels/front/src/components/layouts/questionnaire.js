import React from "react";
import "./questionnaire.css";
import { questions } from "./questions";
import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../config/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const Questionnaire = () => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [showScore, setShowScore] = React.useState(false);
  const [answerArray, setAnswerArray] = React.useState([]);
  const { getCurrentUserId } = useAuth();

  // Access currentUserId
  const userId = getCurrentUserId();


  const [actorArray, setActorArray] = React.useState([]);
  const [actorJSON, setActorJSON] = React.useState("");

  const [movieJSON, setMovieJSON] = React.useState("");

  function handleClick(movieId) {
    setScore(score + 1);
  
    addAnswer(movieId);
  
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      const answerRef = doc(collection(db, "preferredMovie"), userId);
  
      let movieName = "";
  
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
        .then((response) => response.json())
        .then((data) => {
          // Assign movie name to variable
          movieName = data.title;
          console.log("Movie name:", movieName);
          
          // Save answer to Firestore
          const answerData = {
            userId: userId,
            answers: movieName,
          };
          setDoc(answerRef, answerData)
            .then(() => {
              console.log("Answer saved successfully");
            })
            .catch((error) => {
              console.error("Error saving answer: ", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching movie details: ", error);
        });
    }
  }
  
  function callAPI(userId) {
    fetch('https://back-jasonti20.vercel.app/postdatatoFlask/' + userId)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('API response:', data);
      })
      .catch(error => {
        console.error('There was a problem calling the API:', error);
      });
  }
  
  
  

  
  
  
  
  
  
  

  // const { user, logoutUser } = useUserContext();

  function addAnswer(t) {
    //setAnswer(answers + "," + t);
    if (answerArray.length <= currentQuestion) {
      setAnswerArray([...answerArray, t]);
    } else {
      const newArray = answerArray.map((c, i) => {
        if (i === currentQuestion) {
          return t;
        } else {
          return c;
        }
      });
      setAnswerArray(newArray);
    }
  }

  const handleClickMultiple = (event) => {
    if (event.currentTarget.classList.contains("selectedButton")) {
      event.currentTarget.classList.remove("selectedButton");
    } else {
      event.currentTarget.classList.toggle("selectedButton");
    }
  };

  function handleClickSearchFilter() {
    setActorArray([]);
    setActorJSON("");
    let inputName = document.getElementById("nameInput").value;
    let nameQuery = inputName.replace(" ", "+");
    let url =
      "https://api.themoviedb.org/3/search/person?api_key=" +
      API_KEY +
      "&language=en-US&query=" +
      nameQuery;
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (stuff) {
        let jsonData = JSON.parse(JSON.stringify(stuff));
        setActorArray(
          jsonData["results"].map((s) => [
            s.name,
            s.id,
            s.profile_path,
            s.known_for_department,
          ])
        );
        let j = jsonData["results"].map(
          ({ name, id, profile_path, known_for_department }) => ({
            name,
            id,
            profile_path,
            known_for_department,
          })
        );
        j = j.filter(function (item) {
          return (
            item.known_for_department === "Acting" && item.profile_path != null
          );
        });
        setActorJSON(j);

        console.log(actorJSON);
      })
      .catch(function (error) {
        console.log("Found an error: " + error);
      });
  }

  function fetchMovie(genreIds, actorId) {
    setMovieJSON("");
    console.log(genreIds);
    let url =
      "https://api.themoviedb.org/3/person/" +
      actorId +
      "?api_key=" +
      API_KEY +
      "&append_to_response=credits";
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (stuff) {
        let jsonData = JSON.parse(JSON.stringify(stuff));
        console.log(jsonData.credits.cast);
        let j = jsonData.credits.cast.map(
          ({ title, id, genre_ids, poster_path, popularity }) => ({
            title,
            id,
            genre_ids,
            poster_path,
            popularity,
          })
        );

        j = j.filter(function (item) {
          return (
            item.genre_ids.filter((x) =>
              genreIds.map((x) => parseInt(x)).includes(x)
            ).length > 0
          );
        });

        j = j.sort((a, b) => {
          if (a.popularity > b.popularity) {
            return -1;
          }
        });

        if (j.length > 10) {
          j = j.slice(0, 10);
        }

        console.log(j);

        setMovieJSON(j);
      })
      .catch(function (error) {
        console.log("Found an error: " + error);
      });
  }

  return (
    <div>
      {showScore ? (
        <section className="dashboard">
          <div className="dashboard">
            <Link to="../profile">
            <button onClick={() => callAPI(userId)}>continue</button>
            </Link>
          </div>
        </section>
      ) : (
        <>
          <section className="question-section">
            <h1>
              Question {currentQuestion + 1}/{questions.length}
            </h1>
            <p>
              {questions[currentQuestion].questionText +
                " (" +
                questions[currentQuestion].questionType +
                ")"}
            </p>
          </section>

          <section className="answer-section">
            {}
            {currentQuestion === 0 &&
              questions[currentQuestion].answerOptions.map((item) => (
                <button
                  key={item.id}
                  id={item.id}
                  onClick={handleClickMultiple}
                >
                  {item.answerText}
                </button>
              ))}
            {currentQuestion === 1 && (
              <input
                type="text"
                placeholder="Actor or Actress"
                id="nameInput"
              ></input>
            )}
            {currentQuestion === 1 && (
              <button
                onClick={() => {
                  handleClickSearchFilter();
                }}
                class="searchButton"
              >
                Search
              </button>
            )}

            {currentQuestion === 1 &&
              actorJSON.length !== 0 &&
              actorJSON.map((item) => (
                <button
                  key={item.id}
                  id={item.id}
                  onClick={() => {
                    handleClick(item.name);
                    addAnswer(item.id);
                    fetchMovie(answerArray[0], item.id);
                  }}
                >
                  <img
                    src={
                      "https://image.tmdb.org/t/p/original/" + item.profile_path
                    }
                    width="20%"
                    height="50%"
                  ></img>
                  {item.name}
                </button>
              ))}

            {currentQuestion === 2 &&
              movieJSON.length !== 0 &&
              movieJSON.map((cur) => (
                <button
                  key={cur.id}
                  id={cur.id}
                  onClick={() => handleClick(cur.id)}
                >
                  <img
                    src={
                      "https://image.tmdb.org/t/p/original/" + cur.poster_path
                    }
                    width="20%"
                    height="50%"
                  ></img>
                  {cur.title}
                </button>
              ))}
          </section>

          <section className="back-button">
            {currentQuestion !== 0 && (
              <button
                onClick={() => {
                  setCurrentQuestion(currentQuestion - 1);
                }}
              >
                Previous
              </button>
            )}

            {questions[currentQuestion].questionType === "Multiple Choice" && (
              <button
                onClick={() => {
                  const allSelected = Array.from(
                    document.getElementsByClassName("selectedButton")
                  );
                  let multipleAns = "";
                  if (allSelected.length <= 0) {
                    alert(
                      "Please select at least one option, or skip this question."
                    );
                  } else {
                    for (let i = 0; i < allSelected.length; i++) {
                      multipleAns += allSelected[i].id;
                      multipleAns += ",";
                    }
                    multipleAns = multipleAns.slice(0, -1);
                    let multipleAnsArray = multipleAns.split(",");
                    addAnswer(multipleAnsArray);
                    if (currentQuestion < questions.length - 1) {
                      setCurrentQuestion(currentQuestion + 1);
                    } else {
                      setShowScore(true);
                    }
                  }
                }}
              >
                Next
              </button>
            )}
          </section>

          <section className="skip-button">
            {currentQuestion < questions.length - 1 && (
              <button
                onClick={() => {
                  setCurrentQuestion(currentQuestion + 1);
                  addAnswer("Skipped");
                }}
              >
                Skip
              </button>
            )}
            {currentQuestion === questions.length - 1 && (
              <button
                onClick={() => {
                  addAnswer("Skipped");
                  setShowScore(true);
                }}
              >
                Skip
              </button>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Questionnaire;
