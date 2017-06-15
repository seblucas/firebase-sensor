const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.monitor = functions.https.onRequest((req, res) => {
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const tstamp = Math.floor(Date.now() / 1000);
  admin.database().ref('/readings/consigne').limitToLast(1).once("child_added", snapshot => {
    res.set('Cache-Control', 'private, max-age=300');
    differenceInMinutes = (tstamp - snapshot.val().time) / 60;
    result = {current: tstamp,
              sensor: snapshot.val().time,
              diff: Math.round(differenceInMinutes * 10) / 10};
    if (differenceInMinutes < 31) {
      result['status'] = "OK";
    } else {
      result['status'] = "KO";
    }
    return res.status(200).json(result);
  });
});
