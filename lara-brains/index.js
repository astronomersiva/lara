// load config from ENV
require('dotenv').config();

const fs = require('fs');
const fetch = require('node-fetch');

const firebase = require('firebase/app');
require('firebase/database');

const Parker = require('parker/lib/Parker');
const metrics = require('parker/metrics/All');
const parker = new Parker(metrics);

const polka = require('polka');
const bodyParser = require('body-parser');
const cors = require('cors')({ origin:true });
const lara = polka();

const formatNodes = require('./utils/formatNodes');
const getFormattedResponse = (snapshot, shouldFormat) => {
  return Object.keys(snapshot).map((key) => {
    let value = snapshot[key];
    let results = value.results;

    if (results && shouldFormat) {
      value.results = formatNodes(results);
    }

    return value;
  });
};

const getPercentage = (current, previous) => {
  return Number((((previous - current) / previous) * 100).toFixed(2));
}

const getDiff = (results) => {
  let resultsCleaned = Object.keys(results).map((key) => {
    let value = results[key];
    return value.results;
  });

  let result2 = resultsCleaned.pop();
  let result1 = resultsCleaned.pop();
  let rest = resultsCleaned;

  let delta = {};
  let range = {};
  Object.keys(result1).forEach((key) => {
    let previous = result1[key];
    let current = result2[key];

    if (typeof result1[key] === 'number') {
      delta[key] = getPercentage(previous, current);
    } else if (Array.isArray(previous)) {
      delta[key] = delta[key] = getPercentage(previous.length, (current || []).length);
    }

    rest.forEach((stat) => {
      if (range[key]) {
        range[key].push(stat[key]);
      } else {
        range[key] = [stat[key]];
      }
    });

    range[key].push(previous, current);
  });

  return {
    delta,
    range,
    statistics: formatNodes(result2)
  };
}

firebase.initializeApp({
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId
});

const store = firebase.database();

lara
  .use(cors)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .post('/projects', async(request, response) => {
    let { name } = request.body;
    let newProject = await store.ref('/projects').push();
    await newProject.set({ name });

    response.end(JSON.stringify({ id: newProject.key }));
  })
  .get('/projects', async(request, response) => {
    let project = await store.ref(`/projects`).once('value');

    response.end(JSON.stringify(project));
  })
  .post('/analytics', async(request, response) => {
    let { source, project } = request.body;
    let cssResponse = await fetch(source);
    let css = await cssResponse.text();

    let results = parker.run(css.toString());
    let timestamp = firebase.database.ServerValue.TIMESTAMP;
    let newAnalysis = await store.ref(`/analytics/${project}`).push({ timestamp });
    await newAnalysis.setWithPriority({ results, analysedAt: timestamp }, timestamp);

    response.end('Done');
  })
  .get('/analytics', async(request, response) => {
    let projectId = request.headers.project;
    let analytics = await store.ref(`/analytics/${projectId}`)
      .orderByChild('analysedAt')
      .once('value');

    let formattedResponse = getFormattedResponse(analytics.val(), true);

    response.end(JSON.stringify(formattedResponse));
  })
  .get('/dashboard', async(request, response) => {
    let projectId = request.headers.project;
    let analytics = await store.ref(`/analytics/${projectId}`)
      .orderByChild('analysedAt')
      .once('value');

    let diff = getDiff(analytics.val());

    response.end(JSON.stringify(diff));
  });

lara.listen(1511).then(() => {
  console.log(`> Running on localhost:1511`);
});
