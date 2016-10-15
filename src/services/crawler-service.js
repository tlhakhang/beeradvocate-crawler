'use strict';

import fetch from 'node-fetch';
import cheerio from 'cheerio';

let getBeers = (url) => {
  return fetch(url).then((resp) => {
    return resp.text();
  }).then((body) => {
    // process the text body of beers list
    let $ = cheerio.load(body);
    let beers = [];
    return beers;
  }).catch((err) => {
    console.log(err);
  });
}

let getBeer = (url) => {
  return fetch(url).then((resp) => {
    return resp.text();
  }).then((body) => {
    // process the text body of the beer profile
    let $ = cheerio.load(body);
    let beer = {};
    return beer;
  }).catch((err) => {
    console.log(err);
  });
}

export {
  getBeers,
  getBeer
}
