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
  var sensors = ["consigne", "grenier", "cuisine", "deulemont", "palier"];
  var promiseArray = [];
  var result = {};
  for (var i = 0; i < sensors.length; i++) {
    console.log('Adding promise for ' + sensors[i]);
    promiseArray.push(admin.database().ref('/readings/' + sensors[i]).limitToLast(1).once("child_added"));
  }
  Promise.all(promiseArray).then(snapshots => {
    console.log('All promises done : ' + snapshots.length);
    res.set('Cache-Control', 'private, max-age=300');
    for (var i = 0; i < snapshots.length; i++) {
      differenceInMinutes = (tstamp - snapshots[i].val().time) / 60;
      result[sensors[i]] = {current: tstamp,
                            sensor: snapshots[i].val().time,
                            diff: Math.round(differenceInMinutes * 10) / 10};
      if (differenceInMinutes < 31) {
        result[sensors[i]]['status'] = "OK";
      } else {
        result[sensors[i]]['status'] = "KO";
      }
    }
    return res.status(200).json(result);
  }).catch(error => {
    console.log('Error getting message details', error.message);
    res.sendStatus(500);
  });
});
