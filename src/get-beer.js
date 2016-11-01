'use strict'

const RSVP = require('rsvp');
const _ = require('lodash');
const url = require('url');

// custom modules
const crawlerService = require('./services/crawler-service');
const config = require('./config');

let beerLink = process.argv[2] || process.exit(1);

let getBeerInfo = (beerLink) => {
    crawlerService.getBeerInfo(url.parse(beerLink)).then((beer) => {
      console.log(`"${beer.name}", "${beer.state}", "${beer.brewery}", "${beer.beerScore}", "${beer.scoreText}", "${beer.beerStats.reviews}", "${beer.beerStats.ratings}", "${beer.beerStats.avg}", "${beer.beerInfo.style}", "${beer.beerInfo.alcoholByVolume}", "${beer.beerInfo.availability}", "${beer.beerInfo.addedBy}", "${beer.beerInfo.addedDate}" `)
    });
}

getBeerInfo(beerLink);
