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
      console.dir(beer);
    });
}

getBeerLinks(beerLink);
