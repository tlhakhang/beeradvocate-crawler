'use strict';

import fetch from 'node-fetch';
import cheerio from 'cheerio';

let getBeers = (url) => {
  return fetch(url).then((resp) => {
    return resp.text();
  }).then((body) => {
    // process the text body of beers list
    let $ = cheerio.load(body);
    let beers = Array.prototype.map.call($('#rating_fullview_content_2 > h6 > a'), function(i) { return $(i).attr('href'); } );
    return beers;
  }).catch((err) => {
    console.log(err);
  });
}

let getBeer = (url) => {
  console.log('going to ', url);
  return fetch(url).then((resp) => {
    return resp.text();
  }).then((body) => {
    // process the text body of the beer profile
    let $ = cheerio.load(body);
    let title = $('.titleBar > h1').text();
    let score = $('.BAscore_big.ba-score').text();
    let scoreText = $('.ba-score_text').text();
    
    let beer = {
      name: title.split(' | ')[0],
      brewery: title.split(' | ')[1],
      beerScore: score,
      scoreText,
    };
    return beer;
  }).catch((err) => {
    console.log(err);
  });
}

export {
  getBeers,
  getBeer
}
