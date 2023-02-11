const functions = require('firebase-functions');
const SendOtp = require('sendotp');

const sendOtp = new SendOtp('240903ApMGc7Lo5bd8af01');



exports.sendOtp = functions.https.onRequest((req, res) => {

  sendOtp.send("+917567648784", "PRIIND", function (error, data) {
    console.log(data);
  });

});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
