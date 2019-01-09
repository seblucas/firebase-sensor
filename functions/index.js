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

exports.lastupdated = functions.https.onRequest((req, res) => {
  console.log(req.query.r);
  admin.database().ref('/readings/' + req.query.r).limitToLast(1).once('value').then(snapshots => {
    res.set('Cache-Control', 'private, max-age=300');
    let time = 0;
    snapshots.forEach(snapshot => {
      var currentData = snapshot.val();
      time = currentData.time;
    });
    return res.status(200).send(time.toString());
  }).catch(error => {
    console.error('Error while getting sensor detail', error.message);
    res.sendStatus(500);
  });
});
