const express = require("express");
const path = require("path");
const admin = require("firebase-admin");
const cors = require('cors');

const app = express();
// Enable CORS
app.use(cors());


// var bodyParser = require('body-parser');
var request = require("request-promise");

const serviceAccount = require("./serviceAccountKey.json"); // Replace with the path to your service account key file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// app.use(express.static(path.join(__dirname, '../../front/build')));

// // Catch-all route to serve index.html for any other requests
// app.get("*", (req, res) => {

//   res.sendFile(path.join(__dirname, '../front/build', 'index.html'));
// });

// Initialize the Firestore instance
const db = admin.firestore();

// Route to get all data in the "preferredMovie" collection
const preferredMovieRef = db.collection("preferredMovie");
app.get("/postdatatoFlask/:userId", async function (req, res) {
  console.log("test");
  try {
    const querySnapshot = await preferredMovieRef
      .where("userId", "==", req.params.userId)
      .get();
    const doc = querySnapshot.docs[0];

    var data = { title: doc.data().answers };
    console.log("Testdata" + doc.data().answers);
    var options = {
      method: "POST",
      //url: 'http://127.0.0.1:5000/entermovietitle',
      //url: 'http://3.21.93.245:3000/',
      url: "http://ec2-3-140-184-162.us-east-2.compute.amazonaws.com:3000/",
      body: data,
      json: true,
    };

    var returndata;
    var sendrequest = await request(options)
      .then(function (parsedBody) {
        console.log(parsedBody);
        returndata = parsedBody;
      })
      .catch(function (err) {
        console.log(err);
      });

    // Save returndata to Firestore
    if (doc) {
      await doc.ref.set(
        {
          returndata: returndata,
        },
        { merge: true }
      );
    }

    res.send(returndata);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting preferred movies.");
  }
});
app.get("/postdatatoFlask", async function (req, res) {
  console.log(req);
  var data = { title: "Bullet to the Head" };
  var options = {
    method: "POST",
    //url: 'http://127.0.0.1:5000/entermovietitle',
    //url: 'http://3.21.93.245:3000/',
    url: "http://ec2-3-140-184-162.us-east-2.compute.amazonaws.com:3000/",
    body: data,
    json: true,
  };

  var returndata;
  var sendrequest = await request(options)
    .then(function (parsedBody) {
      console.log(parsedBody);
      returndata = parsedBody;
    })
    .catch(function (err) {
      console.log(err);
    });
  res.send(returndata);
  //res.send(returndata);
});



app.get("/api", async (req, res) => {
  console.log("Received request for /api");
  try {
    const querySnapshot = await preferredMovieRef.get();
    const data = querySnapshot.docs.map((doc) => doc.data());
    console.log(`Returning data: ${JSON.stringify(data)}`);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting preferred movies.");
  }
});




const port = process.env.PORT || 8080
// Start the server
console.log("run on " + port)
app.listen(port, () => {
  module.exports = app;
});


// app.get("/api/:userId", async (req, res) => {
//   console.log(`Received request for /api/${req.params.userId}`);
//   try {
//     const querySnapshot = await preferredMovieRef
//       .where("userId", "==", req.params.userId)
//       .get();
//     const data = querySnapshot.docs.map((doc) => doc.data());
//     console.log(`Returning data: ${JSON.stringify(data)}`);
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error getting preferred movies.");
//   }
// });

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the React app
// app.use(express.static(path.join(__dirname, "../frontend/build")));