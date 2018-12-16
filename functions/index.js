/* eslint semi: ["error"] */

const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.monitor = functions.https.onRequest((req, res) => {
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const tstamp = Math.floor(Date.now() / 1000);
  var sensors = ['grenier', 'cuisine', 'deulemont', 'palier'];
  var promiseArray = [];
  var result = {};
  for (var i = 0; i < sensors.length; i++) {
    promiseArray.push(admin.database().ref('/readings/' + sensors[i]).limitToLast(1).once('value'));
  }
  Promise.all(promiseArray).then(queryResults => {
    console.log('All promises done : ' + queryResults.length);
    res.set('Cache-Control', 'private, max-age=300');
    queryResults.forEach((snapshots, i) => {
      if (snapshots.numChildren() === 0) {
        console.log('No data found for %s', sensors[i]);
      }
      snapshots.forEach((snapshot) => {
        var currentData = snapshot.val();
        var differenceInMinutes = (tstamp - currentData.time) / 60;
        result[sensors[i]] = {
          current: tstamp,
          sensor: currentData.time,
          diff: Math.round(differenceInMinutes * 10) / 10
        };
        if (differenceInMinutes < 31) {
          result[sensors[i]]['status'] = 'OK';
        } else {
          result[sensors[i]]['status'] = 'KO';
        }
      });
    });
    return res.status(200).json(result);
  }).catch(error => {
    console.error('Error while getting sensors details', error.message);
    res.sendStatus(500);
  });
});

exports.pushError = functions.https.onRequest((req, res) => {
  if (!req.headers.authorization) {
    console.error('No authorization token provided');
    res.status(403).send('Unauthorized');
    return;
  }
  if (req.method !== 'POST') {
    res.status(400).send('Only POST is allowed');
    return;
  }

  let idToken = req.headers.authorization;
  admin.database().ref('/users/').orderByChild('key').equalTo(idToken).once('value')
    .then(newValue => {
      if (!newValue.val()) {
        console.error('Authorization token not found :');
        res.status(403).send('Unauthorized');
      }
      if (!req.body.hasOwnProperty('time') || !req.body.hasOwnProperty('message')) {
        console.error('Bad data in payload :', req.body);
        res.status(422).send('Bad data');
      }
      console.log('Authentication OK', req.body);
      var newPostRef = admin.database().ref('/errors/').push(req.body);
      res.status(200).json(newPostRef.key);
    })
    .catch(error => {
      console.error('Error while verifying authorization token :', error);
      res.status(403).send('Unauthorized');
    });
});
